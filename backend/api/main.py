"""
FastAPI Backend — BIS Standards AI Assistant API
"""
import os
import sys
import logging
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from backend.rag.engine import RAGEngine
from backend.rag.query_processor import QueryProcessor
from backend.rag.generator import LLMGenerator
from backend.ingestion.pipeline import DocumentIngestionPipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BIS Standards AI Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
logger.info("Initializing RAG Engine...")
rag_engine = RAGEngine()
query_processor = QueryProcessor()
llm_generator = LLMGenerator()


class QueryRequest(BaseModel):
    query: str
    filter_standard: Optional[str] = None


class QueryResponse(BaseModel):
    answer: str
    sources: list
    confidence: str
    language: str
    citations: list
    citation_verification: list = []  # Verified status for each citation


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    standards = rag_engine.get_available_standards()
    total_chunks = rag_engine.vector_store.index.ntotal if rag_engine.vector_store.index else 0
    return {
        "status": "healthy",
        "indexed_chunks": total_chunks,
        "standards": len(standards),
        "llm_provider": llm_generator.llm_provider or "template"
    }


@app.get("/api/standards")
async def get_standards():
    """Get list of indexed standards."""
    return {"standards": rag_engine.get_available_standards()}


@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """Process a query about Indian Standards."""
    try:
        # Process query (detect language, translate)
        original, processed, language = query_processor.process_query(request.query)

        # Retrieve relevant chunks
        results = rag_engine.retrieve(
            processed,
            n_results=5,
            filter_is_number=request.filter_standard
        )

        # Assemble context
        context = rag_engine.assemble_context(results)

        # Generate response
        answer = llm_generator.generate(processed, context, language)

        # Extract citations
        citations = llm_generator.extract_citations(answer)

        # Verify citations against retrieved chunks
        citation_verification = llm_generator.verify_citations(citations, results)

        # Compute verified confidence using real FAISS scores + citation verification
        confidence_data = llm_generator.compute_confidence(answer, results, citations)
        confidence = confidence_data["level"]

        # Build source cards
        sources = []
        for r in results[:5]:
            sources.append({
                "is_number": r.chunk.is_number,
                "title": r.chunk.title,
                "section": r.chunk.section,
                "page": r.chunk.page,
                "score": round(r.score, 3),
                "chunk_id": r.chunk.chunk_id
            })

        return QueryResponse(
            answer=answer,
            sources=sources,
            confidence=confidence,
            language=language,
            citations=citations,
            citation_verification=citation_verification
        )
    except Exception as e:
        logger.error(f"Query error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ingest")
async def ingest_pdfs(directory: Optional[str] = None):
    """Ingest PDF standards from a directory."""
    try:
        pipeline = DocumentIngestionPipeline()
        chunks = pipeline.ingest_directory(directory)
        if chunks:
            rag_engine.vector_store.add_chunks(chunks)
        return {"ingested": len(chunks), "message": f"Ingested {len(chunks)} chunks"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/debug/reload-llm")
async def reload_llm():
    """Retry LLM detection."""
    global llm_generator
    llm_generator = LLMGenerator()
    return {"provider": llm_generator.llm_provider, "model": getattr(llm_generator, 'ollama_model', None)}


@app.get("/api/debug/llm")
async def debug_llm():
    """Debug LLM status."""
    import httpx
    ollama_host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
    if not ollama_host.startswith("http"):
        ollama_host = f"http://{ollama_host}"

    ollama_reachable = False
    ollama_models = []
    try:
        resp = httpx.get(f"{ollama_host}/api/tags", timeout=5.0)
        if resp.status_code == 200:
            ollama_reachable = True
            ollama_models = [m["name"] for m in resp.json().get("models", [])]
    except Exception:
        pass

    return {
        "detected_provider": llm_generator.llm_provider,
        "ollama_reachable": ollama_reachable,
        "ollama_models": ollama_models,
        "ollama_configured_host": ollama_host,
        "has_gemini_key": bool(os.getenv("GEMINI_API_KEY"))
    }
