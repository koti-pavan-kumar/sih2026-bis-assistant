"""
BIS Standards AI Assistant — Main Entry Point
Run this to start the backend server.
"""
import os
import sys
import logging
from pathlib import Path

# Ensure project root is in path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from dotenv import load_dotenv
load_dotenv()

from backend.ingestion.pipeline import DocumentIngestionPipeline
from backend.rag.engine import RAGEngine

logging.basicConfig(level=logging.INFO, format="%(asctime)s — %(message)s")
logger = logging.getLogger(__name__)


def main():
    logger.info("🇮🇳 BIS Standards AI Assistant starting...")

    # Step 1: Ingest sample standards if not already done
    pipeline = DocumentIngestionPipeline()
    rag = RAGEngine()

    if rag.vector_store.index.ntotal == 0:
        logger.info("No data indexed. Running ingestion...")
        chunks = pipeline.ingest_directory()
        if chunks:
            rag.vector_store.add_chunks(chunks)
            logger.info(f"Indexed {len(chunks)} chunks from BIS standards")
        else:
            logger.warning("No PDFs found in data/raw/. Add BIS standard PDFs there.")
    else:
        logger.info(f"FAISS index loaded: {rag.vector_store.index.ntotal} vectors")

    # Step 2: Start the API server
    port = int(os.environ.get("PORT", 8000))
    is_production = os.environ.get("RENDER") is not None
    
    import uvicorn
    uvicorn.run(
        "backend.api.main:app",
        host="0.0.0.0",
        port=port,
        reload=not is_production,
        log_level="info"
    )


if __name__ == "__main__":
    main()
