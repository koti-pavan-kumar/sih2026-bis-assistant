"""
ManakMitra RAG Evaluation Harness
=================================

Runs a fixed question set against the live /api/query endpoint and measures
the numbers the deck used to fake ("95% accuracy", "0 hallucinations").

Metrics (all computed from real responses, nothing hand-set):
  1. Retrieval hit rate     - did the top-1 / top-5 source match the expected IS?
  2. Citation groundedness  - of citations the LLM emitted, how many verify
                              against actually-retrieved chunks? (per-citation
                              and per-answer)
  3. Abstention correctness - on out-of-scope questions, does the system admit
                              "no info" instead of inventing an answer?
  4. Hallucinated citations  - citations emitted on questions with no matching
                              standard (should be 0).
  5. Latency                - avg / p50 / max per query.

Usage (backend must be running on :8000):
    ./venv/Scripts/python.exe scripts/eval_rag.py [--base-url http://127.0.0.1:8000]

Writes EVAL_RESULTS.json + EVAL_RESULTS.md next to this script's repo root.
"""
import argparse
import json
import statistics
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

# (question, category, expected IS base number or None, response_language)
QUESTIONS = [
    # --- Grounded questions over indexed standards -------------------------
    ("What are the grades and requirements of ordinary Portland cement?", "grounded", "IS 269", "en"),
    ("What does IS 2062 specify for structural steel?", "grounded", "IS 2062", "en"),
    ("What is the permissible limit of fluoride in drinking water as per BIS?", "grounded", "IS 10500", "en"),
    ("What are the properties of Fe 500 deformed steel bars?", "grounded", "IS 1786", "en"),
    ("What does IS 456 cover and what is its scope?", "grounded", "IS 456", "en"),
    ("Which Indian Standard governs coarse and fine aggregates for concrete?", "grounded", "IS 383", "en"),
    ("What is Portland pozzolana cement and which standard specifies it?", "grounded", "IS 1489", "en"),
    ("What are the safety requirements for information technology equipment?", "grounded", "IS 13252", "en"),
    ("What does IS 12040 specify?", "grounded", "IS 12040", "en"),
    ("What are the requirements for fly ash used in cement manufacture?", "grounded", "IS 16001", "en"),
    ("What does the standard for Portland slag cement specify?", "grounded", "IS 455", "en"),
    ("How is dimensional change in textile fabrics determined?", "grounded", "IS 1758", "en"),
    ("What are the safety requirements for household refrigerating appliances?", "grounded", "IS 15258", "en"),
    ("What does the standard for synthetic resin emulsion paints cover?", "grounded", "IS 2932", "en"),
    ("What are the specifications for concrete masonry units?", "grounded", "IS 2185", "en"),
    ("What are the requirements for corrugated fibreboard boxes?", "grounded", "IS 13726", "en"),
    ("What are the safety requirements for milk and milk products?", "grounded", "IS 14543", "en"),
    ("What does the standard for full grain leather for footwear specify?", "grounded", "IS 17091", "en"),
    ("What safety requirements apply to electrical appliances?", "grounded", "IS 302", "en"),
    ("What is the acceptable pH range for drinking water in India?", "grounded", "IS 10500", "en"),
    # --- Multilingual (22-language claim) ----------------------------------
    ("सीमेंट के ग्रेड क्या हैं?", "grounded", "IS 269", "hi"),
    ("IS 269 సిమెంట్ ప్రమాణం ఏమి చెబుతుంది?", "grounded", "IS 269", "te"),
    # --- Out-of-scope: must abstain, must not cite ------------------------
    ("What is the GST rate on steel products in India?", "oos", None, "en"),
    ("Who won the Cricket World Cup in 2023?", "oos", None, "en"),
    ("What is the capital of France?", "oos", None, "en"),
    ("How do I register a company under MSME in India?", "oos", None, "en"),
    ("Write me a recipe for masala dosa", "oos", None, "en"),
    # --- Policy questions answerable from static context, no IS expected ---
    ("How long does BIS certification take under Scheme I?", "policy", None, "en"),
]

NO_INFO_PHRASES = [
    "not contain information", "cannot find", "could not find", "no information",
    "does not contain", "not available in the context", "not available",
    "no relevant", "doesn't contain", "i don't have", "do not have",
    "not able to find", "unable to find", "no specific information",
    "not mentioned in the", "outside the scope", "beyond the scope",
]


def post_query(base_url: str, query: str, language: str, timeout: int = 120) -> dict:
    payload = json.dumps({
        "query": query,
        "response_language": language,
        "conversation_history": [],
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{base_url}/api/query",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def base_is(is_num: str) -> str:
    return is_num.split(":")[0].strip() if is_num else ""


def main() -> int:
    # Windows consoles default to cp1252 and crash on Hindi/Telugu questions
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://127.0.0.1:8000")
    ap.add_argument("--out-prefix", default="EVAL_RESULTS")
    args = ap.parse_args()

    root = Path(__file__).parent.parent
    rows = []

    for i, (q, category, expected, lang) in enumerate(QUESTIONS, 1):
        t0 = time.time()
        try:
            data = post_query(args.base_url, q, lang)
        except (urllib.error.URLError, TimeoutError) as e:
            print(f"[{i}/{len(QUESTIONS)}] ERROR  {q!r}: {e}", file=sys.stderr)
            rows.append({"question": q, "category": category, "expected": expected,
                         "language": lang, "error": str(e)})
            continue
        elapsed = time.time() - t0

        sources = data.get("sources", [])
        citations = data.get("citations", [])
        verification = data.get("citation_verification", [])
        answer = data.get("answer", "")
        answer_l = answer.lower()

        top1 = base_is(sources[0]["is_number"]) if sources else ""
        top5 = [base_is(s["is_number"]) for s in sources]
        hit1 = bool(expected) and top1 == expected
        hit5 = bool(expected) and expected in top5

        verified = sum(1 for v in verification if v.get("verified"))
        # Standard-level grounding: citation points at a standard whose chunks
        # WERE retrieved even if the exact section locator didn't match text.
        std_ctx = sum(
            1 for v in verification
            if v.get("verified") or not str(v.get("reason", "")).startswith("Standard not in retrieved chunks")
        )
        total_cit = len(citations)
        abstained = any(p in answer_l for p in NO_INFO_PHRASES)

        row = {
            "question": q,
            "category": category,
            "expected": expected,
            "language": lang,
            "top1": top1,
            "top5": top5,
            "retrieval_hit_top1": hit1,
            "retrieval_hit_top5": hit5,
            "citations_extracted": total_cit,
            "citations_verified": verified,
            "citations_standard_in_context": std_ctx,
            "all_citations_verified": (total_cit == 0 and category != "grounded") or (total_cit > 0 and verified == total_cit),
            "abstained": abstained,
            "confidence": data.get("confidence"),
            "latency_s": round(elapsed, 2),
        }
        rows.append(row)
        # Incremental save so a timeout/crash mid-run keeps partial results
        (root / f"{args.out_prefix}.json").write_text(
            json.dumps({"metrics": None, "rows": rows}, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        flag = "HIT " if hit1 else ("hit5" if hit5 else ("ABS" if category == "oos" and abstained else "MISS"))
        print(f"[{i}/{len(QUESTIONS)}] {flag} {elapsed:5.1f}s cit {verified}/{total_cit}  {q[:70]}")

    # ---- Aggregate ------------------------------------------------------
    ok = [r for r in rows if "error" not in r]
    grounded = [r for r in ok if r["category"] == "grounded"]
    oos = [r for r in ok if r["category"] == "oos"]
    policy = [r for r in ok if r["category"] == "policy"]

    def pct(n, d):
        return round(100.0 * n / d, 1) if d else 0.0

    total_cit = sum(r["citations_extracted"] for r in ok)
    total_ver = sum(r["citations_verified"] for r in ok)
    total_std = sum(r["citations_standard_in_context"] for r in ok)

    metrics = {
        "questions_run": len(ok),
        "errors": len(rows) - len(ok),
        "retrieval_hit_top1_pct": pct(sum(r["retrieval_hit_top1"] for r in grounded), len(grounded)),
        "retrieval_hit_top5_pct": pct(sum(r["retrieval_hit_top5"] for r in grounded), len(grounded)),
        "grounded_answers_with_citations_pct": pct(sum(1 for r in grounded if r["citations_extracted"] > 0), len(grounded)),
        "citation_verification_rate_pct": pct(total_ver, total_cit),
        "citation_standard_context_rate_pct": pct(total_std, total_cit),
        "citations_extracted": total_cit,
        "citations_verified": total_ver,
        "grounded_answers_all_citations_verified_pct": pct(sum(1 for r in grounded if r["all_citations_verified"]), len(grounded)),
        "oos_abstention_rate_pct": pct(sum(1 for r in oos if r["abstained"]), len(oos)),
        "oos_unverified_citations": sum(r["citations_extracted"] - r["citations_verified"] for r in oos),
        "latency_avg_s": round(statistics.mean(r["latency_s"] for r in ok), 2),
        "latency_p50_s": round(statistics.median(r["latency_s"] for r in ok), 2),
        "latency_max_s": round(max(r["latency_s"] for r in ok), 2),
        "confidence_levels": {
            lvl: sum(1 for r in ok if r["confidence"] == lvl)
            for lvl in ("HIGH", "MEDIUM", "LOW", "TEMPLATE")
        },
    }

    (root / f"{args.out_prefix}.json").write_text(
        json.dumps({"metrics": metrics, "rows": rows}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    lines = [
        "# ManakMitra RAG Evaluation Results",
        "",
        f"Questions run: **{metrics['questions_run']}** "
        f"({len(grounded)} grounded, {len(oos)} out-of-scope, {len(policy)} policy) "
        f"— generated by `scripts/eval_rag.py`, no hand-set numbers.",
        "",
        "| Metric | Value |",
        "|---|---|",
        f"| Retrieval hit rate (top-1 source) | {metrics['retrieval_hit_top1_pct']}% |",
        f"| Retrieval hit rate (top-5) | {metrics['retrieval_hit_top5_pct']}% |",
        f"| Grounded answers that cited a standard | {metrics['grounded_answers_with_citations_pct']}% |",
        f"| Citation verification (cited → retrieved chunk) | {metrics['citation_verification_rate_pct']}% ({total_ver}/{total_cit}) |",
        f"| Citations pointing at retrieved standards (any section) | {metrics['citation_standard_context_rate_pct']}% ({total_std}/{total_cit}) |",
        f"| Grounded answers fully citation-verified | {metrics['grounded_answers_all_citations_verified_pct']}% |",
        f"| Abstention on out-of-scope questions | {metrics['oos_abstention_rate_pct']}% |",
        f"| Unverified citations on out-of-scope questions | {metrics['oos_unverified_citations']} |",
        f"| Latency avg / p50 / max | {metrics['latency_avg_s']}s / {metrics['latency_p50_s']}s / {metrics['latency_max_s']}s |",
        f"| Confidence distribution | {metrics['confidence_levels']} |",
        "",
        "## Per-question results",
        "",
        "| # | Category | Expected | Top-1 source | Cited↔context | In-context std | Abstained | Conf | Latency | Question |",
        "|---|---|---|---|---|---|---|---|---|---|",
    ]
    for i, r in enumerate(rows, 1):
        if "error" in r:
            lines.append(f"| {i} | {r['category']} | - | ERROR | - | - | - | - | - | {r['question']} |")
            continue
        lines.append(
            f"| {i} | {r['category']} | {r['expected'] or '-'} | {r['top1'] or '-'} | "
            f"{r['citations_verified']}/{r['citations_extracted']} | "
            f"{r['citations_standard_in_context']}/{r['citations_extracted']} | "
            f"{'yes' if r['abstained'] else 'no'} | {r['confidence']} | {r['latency_s']}s | {r['question']} |"
        )
    (root / f"{args.out_prefix}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print("\n=== METRICS ===")
    print(json.dumps(metrics, indent=2))
    print(f"\nWrote {root / (args.out_prefix + '.json')} and {args.out_prefix}.md")
    return 0 if metrics["errors"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
