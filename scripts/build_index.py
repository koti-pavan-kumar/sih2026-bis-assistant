"""Rebuild FAISS index from all PDFs in data/raw/."""
import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from backend.ingestion.pipeline import DocumentIngestionPipeline
from backend.rag.engine import VectorStore

def main():
    print("=== Rebuilding FAISS Index ===\n")

    # Step 1: Ingest all PDFs
    pipeline = DocumentIngestionPipeline(str(project_root / "data"))
    print("Step 1: Ingesting PDFs from data/raw/...")
    chunks = pipeline.ingest_directory()
    print(f"  Created {len(chunks)} chunks from all PDFs\n")

    if not chunks:
        print("ERROR: No chunks created. Check data/raw/ directory.")
        return

    # Step 2: Build FAISS index
    print("Step 2: Building FAISS index...")
    vector_store = VectorStore()
    vector_store.add_chunks(chunks)
    print(f"  Index contains {vector_store.index.ntotal} vectors\n")

    # Step 3: Verify
    print("Step 3: Verifying indexed standards...")
    standards = vector_store.get_available_standards()
    print(f"  {len(standards)} unique standards indexed:")
    for s in standards:
        print(f"    - {s['is_number']}: {s['title']} ({s['chunk_count']} chunks)")

    print(f"\n=== Done! Total: {vector_store.index.ntotal} vectors across {len(standards)} standards ===")

if __name__ == "__main__":
    main()
