"""Offline retrieval diagnostic: no LLM calls, just query_processor + FAISS.

For each probe question prints processed query + top-10 (score, IS, section).
Used to tune the relevance gate (scores of in-scope vs out-of-scope queries).
"""
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from dotenv import load_dotenv
load_dotenv(project_root / ".env")

from backend.rag.engine import RAGEngine
from backend.rag.query_processor import QueryProcessor

PROBES = [
    ("What are the safety requirements for household refrigerating appliances?", "en"),
    ("What does the standard for full grain leather for footwear specify?", "en"),
    ("सीमेंट के ग्रेड क्या हैं?", "hi"),
    ("IS 269 సిమెంట్ ప్రమాణం ఏమి చెబుతుంది?", "te"),
    ("What are the grades and requirements of ordinary Portland cement?", "en"),
    ("What is the GST rate on steel products in India?", "en"),
    ("Who won the Cricket World Cup in 2023?", "en"),
    ("What is the capital of France?", "en"),
    ("Write me a recipe for masala dosa", "en"),
    ("How do I register a company under MSME in India?", "en"),
]

qp = QueryProcessor()
eng = RAGEngine()

for q, lang in PROBES:
    original, processed, detected = qp.process_query(q)
    results = eng.retrieve(processed, n_results=10)
    print(f"\nQ  [{lang}] {q}")
    print(f"   processed: {processed!r} (detected={detected})")
    for r in results:
        print(f"   {r.score:6.3f}  {r.chunk.is_number:<14} {str(r.chunk.section)[:40]}")
