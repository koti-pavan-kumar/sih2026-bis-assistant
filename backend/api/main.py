"""
FastAPI Backend — BIS Standards AI Assistant API
"""
import os
import sys
import re
import logging
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

# Load .env BEFORE importing any RAG modules (they read env vars at import time)
load_dotenv(project_root / '.env')

from backend.rag.engine import RAGEngine
from backend.rag.query_processor import QueryProcessor
from backend.rag.generator import LLMGenerator
from backend.ingestion.pipeline import DocumentIngestionPipeline
from backend.ingestion.auto_fetcher import BISAutoFetcher
from backend.data.bis_offices import (
    BIS_REGIONAL_OFFICES, PRODUCT_CATEGORIES,
    find_nearest_centers, get_offices_by_state, get_offices_by_service, get_product_guidance
)
from backend.data.certifications import (
    CERTIFICATION_TYPES, CERTIFICATION_FAQS, CERTIFICATION_OFFICES,
    get_certification_info, get_all_certifications, get_certification_offices
)
from backend import auth as auth_store
from backend.rag.query_processor import INDIAN_LANGUAGES, detect_reply_language

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Queries about certification/offices can be answered from the static
# CERTIFICATION_TYPES / BIS_REGIONAL_OFFICES context even when retrieval
# finds no standard excerpts — everything else with empty retrieval must
# abstain deterministically (asking the LLM to "not hallucinate" with an
# empty context demonstrably fails: it still emits [IS ...] citations).
CERT_CONTEXT_KEYWORDS = (
    "certif", "licen", "licence", "scheme", "isi mark", "bis mark",
    "office", "laborator", "laborator", "testing cent", "audit",
    "bis act", "application", "document", "timeline", "how long",
    "process", "contact", "phone", "address", "regional",
)


def _is_cert_or_office_query(query: str) -> bool:
    q = query.lower()
    return any(k in q for k in CERT_CONTEXT_KEYWORDS)


def _abstention_answer(query: str) -> str:
    topic = re.sub(r"\s+", " ", query).strip().rstrip("?!. ")[:80] or "This question"
    return (
        f"# {topic}\n\n"
        "I could not find relevant Indian Standard excerpts for this question in the "
        "indexed BIS knowledge base (28 standards, 122 sections), so I cannot answer "
        "it reliably. Please ask about a covered topic — for example cement (IS 269), "
        "structural steel (IS 2062), drinking water (IS 10500), or concrete (IS 456)."
    )

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
    response_language: Optional[str] = "en"  # Language code for response translation
    conversation_history: Optional[list] = []  # Multi-turn context [{role, content}]


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
        "llm_provider": llm_generator.llm_provider or "template",
        # Last LLM failure reason (None = last generation succeeded).
        # Lets us see from outside WHY Gemini is failing (bad key, quota, timeout).
        "llm_last_error": getattr(llm_generator, "last_error", None)
    }


@app.get("/api/standards")
async def get_standards():
    """Get list of indexed standards."""
    return {"standards": rag_engine.get_available_standards()}


@app.get("/api/standards/{is_number}")
async def get_standard_detail(is_number: str):
    """Sections and excerpted text behind one indexed standard.

    Powers the card detail view on the Standards page — a card is a real
    door into the retrieved corpus, not a dead tile.
    """
    chunks = [c for c in rag_engine.vector_store.chunks if c.is_number == is_number]
    if not chunks:
        raise HTTPException(status_code=404, detail="Standard not indexed")
    return {
        "is_number": is_number,
        "title": chunks[0].title,
        "chunk_count": len(chunks),
        "sections": [
            {
                "section": c.section or "General",
                "page": c.page,
                "excerpt": (c.text[:400] + " …") if len(c.text) > 400 else c.text,
            }
            for c in chunks
        ],
    }


@app.get("/api/stats")
async def stats():
    """Single source of truth for every count the UI/PPT claims.

    Deck numbers (standards indexed, languages, offices, certifications)
    must be read from here — never hand-typed — so slides can't drift
    from reality.
    """
    try:
        fetched_count = len(BISAutoFetcher().get_fetched_history())
    except Exception:
        fetched_count = 0
    standards = rag_engine.get_available_standards()
    chunks = rag_engine.vector_store.index.ntotal if rag_engine.vector_store.index else 0
    return {
        "standards_indexed": len(standards),
        "chunks_indexed": chunks,
        "standards_fetched": fetched_count,
        "languages_supported": len(INDIAN_LANGUAGES),  # 22 Indian languages
        "offices_mapped": len(BIS_REGIONAL_OFFICES),
        "certifications_covered": len(CERTIFICATION_TYPES),
    }


# ---------------------------------------------------------------- auth

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = ""
    userType: Optional[str] = "individual"
    organization: Optional[str] = ""
    gstNumber: Optional[str] = ""
    state: Optional[str] = ""
    district: Optional[str] = ""


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/api/auth/register")
async def auth_register(payload: RegisterRequest):
    """Register: bcrypt-hashed password, returns a signed JWT session."""
    try:
        user, token = auth_store.register_user(
            name=payload.name,
            email=payload.email,
            password=payload.password,
            phone=payload.phone or "",
            user_type=payload.userType or "individual",
            organization=payload.organization or "",
            gst_number=payload.gstNumber or "",
            state=payload.state or "",
            district=payload.district or "",
        )
        return {"token": token, "user": user}
    except auth_store.AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@app.post("/api/auth/login")
async def auth_login(payload: LoginRequest):
    """Verify credentials against bcrypt hashes; returns a signed JWT."""
    try:
        user, token = auth_store.login_user(payload.email, payload.password)
        return {"token": token, "user": user}
    except auth_store.AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@app.get("/api/auth/me")
async def auth_me(authorization: Optional[str] = Header(default=None)):
    """Resolve the current user from a Bearer JWT (401 if missing/invalid)."""
    user = auth_store.user_from_authorization(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"user": user}


@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """Process a query about Indian Standards."""
    try:
        # Process query (detect language, translate)
        original, processed, language = query_processor.process_query(request.query)

        # Retrieve relevant chunks (10 so per-standard diversification can
        # surface competing candidate standards; only top 5 become context)
        results = rag_engine.retrieve(
            processed,
            n_results=10,
            filter_is_number=request.filter_standard
        )

        # Assemble context
        context = rag_engine.assemble_context(results)

        # Add BIS offices and certification info to context
        from backend.data.bis_offices import BIS_REGIONAL_OFFICES
        from backend.data.certifications import CERTIFICATION_TYPES, CERTIFICATION_FAQS
        
        offices_text = "\n\nBIS Regional Offices and Testing Centres:\n"
        for office in BIS_REGIONAL_OFFICES[:15]:
            offices_text += f"- {office['name']} ({office['type']}), {office['city']}, {office['state']}: Phone {office['phone']}, Services: {', '.join(office['services'])}\n"
        
        certs_text = "\n\nBIS Certification Types:\n"
        for cert_id, cert in CERTIFICATION_TYPES.items():
            certs_text += f"- {cert['name']}: {cert['description'][:100]}... Duration: {cert['total_duration']}\n"
            if cert.get('mandatory_products'):
                certs_text += f"  Mandatory for: {', '.join(cert['mandatory_products'][:3])}\n"
        
        context += offices_text + certs_text

        # Generate the response directly in the language the user selected.
        # Passing the auto-detected INPUT language here made English requests
        # answer in Hindi: langdetect misclassifies short queries such as
        # "steel doors", process_query defaults its 'auto' branch to 'hi',
        # and no back-translation ever ran for response_lang == "en".
        response_lang = request.response_language or "en"

        # …but a message WRITTEN in a non-Latin script must be answered in
        # that language regardless of the selector: a Hindi/Tamil question
        # gets a Hindi/Tamil answer. Script detection is unambiguous (unlike
        # langdetect), and Latin-script input keeps the selected language.
        script_lang = detect_reply_language(request.query)
        if script_lang:
            response_lang = script_lang

        # No standard excerpts passed the relevance gate and the question is
        # not about certification/offices → answer honestly without the LLM.
        if not results and not _is_cert_or_office_query(request.query):
            answer = _abstention_answer(request.query)
            if response_lang != "en":
                answer = llm_generator.translate_answer(answer, response_lang)
            return QueryResponse(
                answer=answer,
                sources=[],
                confidence="LOW",
                language=response_lang,
                citations=[],
                citation_verification=[],
            )

        answer = llm_generator.generate(processed, context, response_lang, request.conversation_history)
        
        # Always translate the response to the user's selected language.
        # (Gemini sometimes ignores the language instruction in the prompt, and
        # the Google free-translate endpoint both rate-limits and refuses
        # >5000-char texts — so translation runs through the LLM itself with
        # citations/URLs masked.)
        # Skip translation for the no-LLM fallback so its first-line marker
        # stays intact (the frontend detects it and renders plain text).
        is_fallback = answer.startswith((
            "The AI service is briefly unavailable",
            "Based on the available BIS standard excerpts",
        ))
        if not is_fallback:
            if response_lang != "en":
                answer = llm_generator.translate_answer(answer, response_lang)
        elif not llm_generator.looks_english(answer):
            # The model answered in another language anyway (it sometimes
            # mimics a non-English conversation history) — translate back.
            answer = llm_generator.translate_answer(answer, "en")

        # Empty retrieval + LLM path (certification/office questions): the
        # model must not cite IS standards it "recalls" — no chunk backs them.
        if not results:
            answer = re.sub(r'\[IS\s+\d[^\]\n]*\]', '', answer)

        # Extract citations
        citations = llm_generator.extract_citations(answer)

        # Verify citations against retrieved chunks
        citation_verification = llm_generator.verify_citations(citations, results)

        # Compute verified confidence using real FAISS scores + citation verification
        confidence_data = llm_generator.compute_confidence(answer, results, citations)
        confidence = confidence_data["level"]
        
        # If no LLM is available, mark as template mode instead of fake confidence
        if llm_generator.llm_provider is None:
            confidence = "TEMPLATE"

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
            language=response_lang,  # Return user's selected language, not detected language
            citations=citations,
            citation_verification=citation_verification
        )
    except Exception as e:
        logger.error(f"Query error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/api/bis-offices")
async def get_bis_offices(
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    state: Optional[str] = None,
    service: Optional[str] = None,
    n: Optional[int] = 10
):
    """Get BIS testing centers and offices.
    
    - With lat/lng: returns nearest offices sorted by distance
    - With state: returns offices in that state
    - With service: returns offices offering that service
    - Without params: returns all offices
    """
    try:
        if lat is not None and lng is not None:
            offices = find_nearest_centers(lat, lng, n=n)
        elif state:
            offices = get_offices_by_state(state)
        elif service:
            offices = get_offices_by_service(service)
        else:
            offices = BIS_REGIONAL_OFFICES
        
        return {
            "offices": offices,
            "total": len(offices),
            "user_location": {"lat": lat, "lng": lng} if lat and lng else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/bis-offices/categories")
async def get_product_categories():
    """Get all product categories with their BIS standards."""
    return {"categories": PRODUCT_CATEGORIES}


@app.get("/api/certifications")
async def list_certifications():
    """List all certification types with summaries."""
    return {"certifications": get_all_certifications()}


@app.get("/api/certifications/{cert_type}")
async def get_certification(cert_type: str):
    """Get detailed info for a certification type."""
    cert = get_certification_info(cert_type)
    if not cert:
        raise HTTPException(status_code=404, detail="Certification type not found")
    return cert


@app.get("/api/certifications/offices/{state}")
async def cert_offices_by_state(state: str):
    """Get certification offices in a state."""
    return {"offices": get_certification_offices(state), "state": state}


@app.get("/api/certifications/faqs")
async def cert_faqs():
    """Get certification FAQs."""
    return {"faqs": CERTIFICATION_FAQS}


@app.get("/api/bis-offices/{office_id}")
async def get_office_detail(office_id: str):
    """Get detailed info about a specific BIS office."""
    for office in BIS_REGIONAL_OFFICES:
        if office["id"] == office_id:
            return office
    raise HTTPException(status_code=404, detail="Office not found")


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


@app.post("/api/fetch-new-standards")
async def fetch_new_standards():
    """Fetch new BIS standards from bis.gov.in and ingest them.
    
    This is the key automation feature — scrapes BIS website for new
    standard announcements, downloads PDFs, and adds them to the index.
    """
    try:
        fetcher = BISAutoFetcher()
        result = fetcher.fetch_and_ingest()
        
        # Refresh the RAG engine to pick up new standards
        global rag_engine
        rag_engine = RAGEngine()
        
        return {
            "status": "success",
            "new_standards_found": result["new_standards_found"],
            "downloaded": result["downloaded"],
            "ingested_chunks": result["ingested"],
            "already_existed": result["already_existed"],
            "standards": result["standards"],
            "errors": result["errors"],
            "total_indexed": len(rag_engine.get_available_standards()),
        }
    except Exception as e:
        logger.error(f"Auto-fetch error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/fetch-check")
async def check_for_new_standards():
    """Quick check — what new standards are available on BIS?"""
    try:
        fetcher = BISAutoFetcher()
        result = fetcher.check_for_updates()
        return result
    except Exception as e:
        logger.error(f"Fetch check error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/fetch-history")
async def fetch_history():
    """Get history of all auto-fetched standards."""
    try:
        fetcher = BISAutoFetcher()
        return {"history": fetcher.get_fetched_history()}
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
