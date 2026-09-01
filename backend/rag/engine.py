"""
RAG Engine — FAISS-based vector store and retrieval.
"""
import os
import pickle
import logging
from pathlib import Path
from typing import List, Optional
from dataclasses import dataclass

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from backend.ingestion.pipeline import TextChunk

logger = logging.getLogger(__name__)


@dataclass
class RetrievalResult:
    """Result from vector search."""
    chunk: TextChunk
    score: float
    rank: int


class VectorStore:
    """FAISS-based vector store for BIS standard chunks."""

    def __init__(self, persist_dir: str = None, model_name: str = "all-MiniLM-L6-v2"):
        if persist_dir is None:
            persist_dir = str(Path(__file__).parent.parent.parent / "data" / "chroma_db")
        self.persist_dir = Path(persist_dir)
        self.persist_dir.mkdir(parents=True, exist_ok=True)

        self.index_path = self.persist_dir / "faiss.index"
        self.metadata_path = self.persist_dir / "metadata.pkl"

        logger.info(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()

        self.index: Optional[faiss.Index] = None
        self.chunks: List[TextChunk] = []

        self._load_or_create()

    def _load_or_create(self):
        """Load existing index or create new one."""
        if self.index_path.exists() and self.metadata_path.exists():
            try:
                self.index = faiss.read_index(str(self.index_path))
                with open(self.metadata_path, "rb") as f:
                    self.chunks = pickle.load(f)
                logger.info(f"Loaded FAISS index: {self.index.ntotal} vectors, {len(self.chunks)} chunks")
                return
            except Exception as e:
                logger.warning(f"Failed to load index: {e}")

        self.index = faiss.IndexFlatIP(self.dimension)  # Inner product for cosine sim
        self.chunks = []

    def add_chunks(self, chunks: List[TextChunk]):
        """Add chunks to the vector store."""
        if not chunks:
            return

        texts = [c.text for c in chunks]
        embeddings = self.model.encode(texts, show_progress_bar=True, normalize_embeddings=True)
        embeddings = np.array(embeddings, dtype=np.float32)

        self.index.add(embeddings)
        self.chunks.extend(chunks)

        self._save()
        logger.info(f"Added {len(chunks)} chunks. Total: {self.index.ntotal}")

    def search(
        self,
        query: str,
        n_results: int = 5,
        filter_is_number: str = None
    ) -> List[RetrievalResult]:
        """Search for relevant chunks."""
        if self.index is None or self.index.ntotal == 0:
            return []

        query_embedding = self.model.encode([query], normalize_embeddings=True)
        query_embedding = np.array(query_embedding, dtype=np.float32)

        k = min(n_results * 2, self.index.ntotal) if filter_is_number else min(n_results, self.index.ntotal)
        scores, indices = self.index.search(query_embedding, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.chunks):
                continue
            chunk = self.chunks[idx]
            if filter_is_number and chunk.is_number != filter_is_number:
                continue
            results.append(RetrievalResult(
                chunk=chunk,
                score=float(score),
                rank=len(results) + 1
            ))
            if len(results) >= n_results:
                break

        return results

    def _save(self):
        """Persist index and metadata to disk."""
        faiss.write_index(self.index, str(self.index_path))
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.chunks, f)

    def get_available_standards(self) -> List[dict]:
        """Get list of unique indexed standards."""
        seen = {}
        for chunk in self.chunks:
            if chunk.is_number not in seen:
                seen[chunk.is_number] = {
                    "is_number": chunk.is_number,
                    "title": chunk.title,
                    "chunk_count": 0
                }
            seen[chunk.is_number]["chunk_count"] += 1
        return list(seen.values())


class RAGEngine:
    """Main RAG engine combining retrieval and context assembly."""

    def __init__(self):
        self.vector_store = VectorStore()
        self.max_context_chunks = 5
        self.min_relevance_score = 0.2

    def retrieve(self, query: str, n_results: int = 5, filter_is_number: str = None) -> List[RetrievalResult]:
        """Retrieve relevant chunks for a query."""
        results = self.vector_store.search(query, n_results=n_results, filter_is_number=filter_is_number)
        filtered_results = [r for r in results if r.score >= self.min_relevance_score]
        logger.info(f"Retrieved {len(filtered_results)} relevant chunks (from {len(results)} total)")
        return filtered_results

    def assemble_context(self, results: List[RetrievalResult]) -> str:
        """Assemble context from retrieval results for LLM prompt."""
        if not results:
            return "No relevant standards found."

        context_parts = []
        for r in results[:self.max_context_chunks]:
            header = f"[{r.chunk.is_number} - {r.chunk.title}]"
            if r.chunk.section:
                header += f" ({r.chunk.section})"
            header += f" [Page {r.chunk.page}]"
            context_parts.append(f"{header}\n{r.chunk.text}")

        return "\n\n---\n\n".join(context_parts)

    def get_available_standards(self) -> List[dict]:
        """Get available indexed standards."""
        return self.vector_store.get_available_standards()
