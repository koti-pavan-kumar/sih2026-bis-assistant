"""Fix credibility issues across judge-facing docs (HTML slides, README, Q&A).

Every replacement is verified; the script refuses to write if any miss.
Usage: python scripts/fix_docs.py [--dry-run]
"""
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent  # bis-assistant/
WORKSPACE = ROOT.parent

LIVE_URL = "sih2026-bis-assistant-ebon.vercel.app"

MIT = {
    "Data Security": "JWT auth + bcrypt; minimal PII stored",
    "User Adoption": "WhatsApp-style chat UI; no training needed",
    "Scalability": "Modular RAG - add a PDF to add a standard",
    "Language Accuracy": "LLM translation fallback + translate-back",
    "Data Freshness": "Auto-fetch pipeline polls bis.gov.in",
}


def desc(text):
    return ('<div class="challenge-desc" style="font-size:7.5px;color:#666;'
            f'text-align:center;margin-top:3px;line-height:1.25;">{text}</div>')


# (relative-to-bis-assistant unless prefixed with @ for workspace root, old, new)
FIXES = [
    # ---- slide-feasibility.html: the 95%/0-hallucination strip + empty
    #      mitigations + speculative viability claims ---------------------
    ("docs/slide-feasibility.html",
     "63M+ MSMEs in India struggle with BIS compliance. No free AI tool exists for this.",
     "63M+ MSMEs in India struggle with BIS compliance. Free AI tools answer generically &mdash; none indexes official IS text with section-level citations."),
    ("docs/slide-feasibility.html",
     "Source-grounded RAG ensures responses cite official BIS documents. No hallucinations on legal info.",
     "Cited sources on every answer; 97.8% of IS references verified against retrieved text (28-question eval harness in the repo)."),
    ("docs/slide-feasibility.html",
     "Potential BIS official data provider status. Revenue share on certified leads from testing labs.",
     "No committed partners yet &mdash; outreach planned to BIS-recognized labs and MSME bodies; freemium subscriptions as the revenue model."),
    ("docs/slide-feasibility.html",
     'color:#2e7d32;">95%</div>', 'color:#2e7d32;">97.8%</div>'),
    ("docs/slide-feasibility.html",
     'color:#555;">RAG Accuracy</div>', 'color:#555;">Citations Verified</div>'),
    ("docs/slide-feasibility.html",
     'color:#e65100;">0</div>', 'color:#e65100;">100%</div>'),
    ("docs/slide-feasibility.html",
     'color:#555;">Hallucinations</div>', 'color:#555;">Off-Topic Refusals</div>'),
    *[
        ("docs/slide-feasibility.html",
         f'<div class="challenge-name">{name}</div>',
         f'<div class="challenge-name">{name}</div>\n            {desc(mit)}')
        for name, mit in MIT.items()
    ],
    # ---- problems/solutions slide ---------------------------------------
    ("docs/slide-problems-solutions.html",
     "ensures responses are <b>hallucination-free</b> and cite official BIS document sections.",
     "ensures responses are <b>citation-verified</b> against retrieved standard text (97.8% pass rate)."),
    ("docs/slide-problems-solutions.html",
     "keeping the knowledge base <b>always up-to-date</b>.",
     "keeping the knowledge base <b>current</b>."),
    # ---- impact slide -----------------------------------------------------
    ("docs/slide-impact-benefits.html",
     "All responses cite official BIS documents. Zero hallucinations on legal info.",
     "All responses cite official BIS documents; 97.8% of references verified in a 28-question eval."),
    ("docs/slide-impact-benefits.html",
     "<td>BIS Data Licensing</td>", "<td>Data Engineering</td>"),
    # ---- tech-stack slide -------------------------------------------------
    ("docs/slide-techstack.html",
     "384-dim vectors, zero hallucination", "384-dim vectors, citation-verified output"),
    ("docs/slide-techstack.html",
     "Domain-specific RAG with verified BIS documents — no hallucinations on legal info",
     "Domain-specific RAG over indexed BIS documents — every answer cites its source (97.8% verified)"),
    # ---- full presentation html ------------------------------------------
    ("docs/sih-presentation.html",
     "No AI hallucination — only verified government documents.",
     "Every answer cites the retrieved document; 97.8% of references verified in a 28-question eval."),
    ("docs/sih-presentation.html",
     "115+ document chunks indexed.", "122 document chunks indexed."),
    ("docs/sih-presentation.html", "manakmitra-frontend.vercel.app", LIVE_URL),
    # ---- architecture diagrams -------------------------------------------
    ("docs/architecture.html",
     "FAISS (73 chunks, 18 standards)", "FAISS (122 chunks, 28 standards)"),
    ("docs/architecture.svg",
     "73 chunks, 18 standards", "122 chunks, 28 standards"),
    ("docs/architecture-diagram.html",
     "Cosine similarity search across 115+ indexed document chunks from 28 BIS standards.",
     "Cosine similarity search across 122 indexed document chunks from 28 BIS standards."),
    ("docs/architecture-diagram.html",
     '115+ Chunks', '122 Chunks'),
    # ---- techstack page ---------------------------------------------------
    ("docs/techstack.html", ">Gemini 3.5 Flash<", ">Gemini Flash (3.6)<"),
    # ---- landing preview ---------------------------------------------------
    ("docs/landing-preview.html",
     '<div class="stat-value">115</div>', '<div class="stat-value">122</div>'),
    ("docs/landing-preview.html",
     "No guessing, no hallucination.",
     "Every citation checked against the retrieved standard text."),
    # ---- README ------------------------------------------------------------
    ("README.md",
     "18 standards across 8 domains, 73 total chunks:",
     "28 standards across 8 domains, 122 total chunks:"),
    ("README.md",
     "Top-5 chunks from 73 total vectors", "Top-5 chunks from 122 total vectors"),
    # ---- judge Q&A ---------------------------------------------------------
    ("docs/JUDGE_QA_BIBLE.txt",
     "1. Gemini 3.5 Flash (Google) — Used when you have an internet connection.",
     "1. Gemini Flash (Google) — Used when you have an internet connection."),
    ("docs/JUDGE_QA_BIBLE.txt",
     "- Cost: Gemini 3.5 Flash is free for moderate usage.",
     "- Cost: Gemini Flash is free for moderate usage."),
    ("SIH_JUDGE_QA.txt",
     "FAISS searches 115+ document chunks, finds top 5 matches.",
     "FAISS searches 122 document chunks, finds top 10 matches."),
    ("SIH_JUDGE_QA.txt",
     "text chunks are stored alongside for retrieval. Total: 115+",
     "text chunks are stored alongside for retrieval. Total: 122"),
]


def main():
    dry = "--dry-run" in sys.argv
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    misses, edits = [], {}
    for rel, old, new in FIXES:
        path = (WORKSPACE / rel[1:]) if rel.startswith("@") else (ROOT / rel)
        text = path.read_text(encoding="utf-8")
        n = text.count(old)
        if n == 0:
            misses.append((rel, old[:70]))
            continue
        edits.setdefault(path, [text, 0])
        edits[path][0] = edits[path][0].replace(old, new)
        edits[path][1] += n
        print(f"OK  {n}x  {rel}  ::  {old[:64]}")
    for rel, old in misses:
        print(f"MISS     {rel}  ::  {old}")
    if misses:
        print(f"\n{len(misses)} misses - nothing written")
        return 1
    if not dry:
        for path, (text, n) in edits.items():
            path.write_text(text, encoding="utf-8")
            print(f"saved {path.name} ({n} replacements)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
