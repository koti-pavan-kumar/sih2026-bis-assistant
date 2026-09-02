"""
BIS Standards Document Ingestion Pipeline
Parses PDF standards and creates semantic chunks for vector storage.
"""
import os
import re
import json
import hashlib
import logging
from pathlib import Path
from typing import List, Dict, Tuple
from dataclasses import dataclass, field, asdict

import pdfplumber

logger = logging.getLogger(__name__)


@dataclass
class TextChunk:
    """A semantic chunk of text from a BIS standard."""
    text: str
    is_number: str
    title: str
    section: str = ""
    page: int = 0
    chunk_id: str = ""
    metadata: Dict = field(default_factory=dict)

    def __post_init__(self):
        if not self.chunk_id:
            content = f"{self.is_number}:{self.section}:{self.text[:200]}"
            self.chunk_id = hashlib.md5(content.encode()).hexdigest()[:12]


class DocumentIngestionPipeline:
    """Pipeline for ingesting BIS standard PDFs."""

    def __init__(self, data_dir: str = None):
        if data_dir is None:
            data_dir = str(Path(__file__).parent.parent.parent / "data")
        self.data_dir = Path(data_dir)
        self.raw_dir = self.data_dir / "raw"
        self.processed_dir = self.data_dir / "processed"
        self.processed_dir.mkdir(parents=True, exist_ok=True)

    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict]:
        """Extract text from a PDF file page by page."""
        pages = []
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text() or ""
                    if text.strip():
                        pages.append({
                            "page_num": i + 1,
                            "text": text.strip()
                        })
                    # Also extract tables
                    tables = page.extract_tables()
                    for table in tables:
                        if table:
                            table_text = "\n".join(
                                [" | ".join([str(c) if c else "" for c in row]) for row in table]
                            )
                            if table_text.strip():
                                pages.append({
                                    "page_num": i + 1,
                                    "text": table_text.strip(),
                                    "is_table": True
                                })
        except Exception as e:
            logger.error(f"Error extracting from {pdf_path}: {e}")
        return pages

    def identify_standard(self, text: str, filename: str) -> Tuple[str, str]:
        """Identify the IS number and title from the text."""
        # Try to find IS number pattern
        is_match = re.search(r'IS\s+(\d+)(?::(\d{4}))?', text[:2000])
        if is_match:
            is_num = f"IS {is_match.group(1)}"
            if is_match.group(2):
                is_num += f":{is_match.group(2)}"
        else:
            is_num = Path(filename).stem

        # Try to find title (line before Specification/Title or "Title: ..." pattern)
        # First try with colon: "Specification: ..."
        title_match = re.search(
            r'(?:^|\n)\s*(?:Title|Standard|Specification|Code of Practice)\s*:\s*(.+?)(?:\n|$)',
            text[:3000],
            re.IGNORECASE
        )
        if title_match:
            title = title_match.group(1).strip()
        else:
            # Try to find title as the line BEFORE "Specification" or "Title"
            lines = text[:3000].split('\n')
            title = is_num
            for i, line in enumerate(lines):
                if re.match(r'^(Specification|Title|Standard|Code of Practice)$', line.strip(), re.IGNORECASE):
                    # Use the previous line as the title
                    if i > 0:
                        prev_line = lines[i-1].strip()
                        if prev_line and len(prev_line) > 3:
                            title = prev_line
                            break

        return is_num, title

    def extract_section(self, text: str) -> str:
        """Extract section/clause information from text."""
        section_match = re.search(
            r'(?:Clause|Section|Annex)\s+([\d.]+)',
            text[:500],
            re.IGNORECASE
        )
        if section_match:
            return f"Section {section_match.group(1)}"
        return ""

    def create_chunks(
        self,
        pages: List[Dict],
        is_number: str,
        title: str,
        chunk_size: int = 1000,
        overlap: int = 200
    ) -> List[TextChunk]:
        """Create semantic chunks from extracted pages."""
        chunks = []

        for page_data in pages:
            text = page_data["text"]
            page_num = page_data["page_num"]

            # Split into paragraphs first
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

            current_chunk = ""
            for para in paragraphs:
                if len(current_chunk) + len(para) > chunk_size and current_chunk:
                    section = self.extract_section(current_chunk)
                    chunks.append(TextChunk(
                        text=current_chunk.strip(),
                        is_number=is_number,
                        title=title,
                        section=section,
                        page=page_num,
                        metadata={"source": "pdf", "is_table": page_data.get("is_table", False)}
                    ))
                    # Keep overlap
                    words = current_chunk.split()
                    current_chunk = " ".join(words[-overlap:]) + "\n\n" + para
                else:
                    current_chunk += "\n\n" + para if current_chunk else para

            # Don't forget the last chunk
            if current_chunk.strip():
                section = self.extract_section(current_chunk)
                chunks.append(TextChunk(
                    text=current_chunk.strip(),
                    is_number=is_number,
                    title=title,
                    section=section,
                    page=page_num,
                    metadata={"source": "pdf", "is_table": page_data.get("is_table", False)}
                ))

        return chunks

    def ingest_pdf(self, pdf_path: str) -> List[TextChunk]:
        """Ingest a single PDF file."""
        logger.info(f"Ingesting: {pdf_path}")
        pages = self.extract_text_from_pdf(pdf_path)

        if not pages:
            logger.warning(f"No text extracted from {pdf_path}")
            return []

        is_number, title = self.identify_standard(pages[0]["text"], pdf_path)
        chunks = self.create_chunks(pages, is_number, title)

        logger.info(f"Created {len(chunks)} chunks for {is_number}")
        return chunks

    def ingest_directory(self, directory: str = None) -> List[TextChunk]:
        """Ingest all PDFs from a directory."""
        if directory is None:
            directory = str(self.raw_dir)

        all_chunks = []
        pdf_dir = Path(directory)

        if not pdf_dir.exists():
            logger.warning(f"Directory not found: {directory}")
            return all_chunks

        for pdf_file in pdf_dir.glob("**/*.pdf"):
            chunks = self.ingest_pdf(str(pdf_file))
            all_chunks.extend(chunks)

        # Save processed chunks
        if all_chunks:
            self.save_chunks(all_chunks)

        return all_chunks

    def save_chunks(self, chunks: List[TextChunk]):
        """Save chunks to JSON for reuse."""
        output_file = self.processed_dir / "chunks.json"
        data = [asdict(c) for c in chunks]
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved {len(chunks)} chunks to {output_file}")

    def load_chunks(self) -> List[TextChunk]:
        """Load previously processed chunks."""
        chunks_file = self.processed_dir / "chunks.json"
        if not chunks_file.exists():
            return []

        with open(chunks_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        return [TextChunk(**item) for item in data]
