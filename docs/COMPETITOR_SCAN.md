# Competitor & Prior-Art Scan — ManakMitra (SIH 2026, PS SIH26107)

Prepared October 2026. Method: direct product use and public documentation.
Claims are deliberately conservative — anything not verifiable is marked
"not known to". Re-verify before the jury demo.

## The question this scan answers

> "Free AI tools exist — why is this needed?"

Because a general assistant can *talk about* IS standards but cannot
**retrieve and cite the actual indexed standard text at section level**.
Every row below is checked on that one dimension plus price.

## Comparison

| Option | Indexes official IS text? | Section-level citations you can verify | Indian languages | Cost to an MSME |
|---|---|---|---|---|
| General AI assistants (ChatGPT, Gemini, Copilot, etc.) | No — answers from model memory | No — citations cannot be traced to retrieved source text | Partial, varies by product | Free tiers exist |
| Web search + bis.gov.in | Pages only | N/A — no synthesized answers | English/Hindi site | Free pages; standards PDFs are per-standard paid |
| Paid compliance consultants | Human expertise | Report-based, per engagement | As hired | Paid, per engagement |
| Global standards platforms (ISO/IEC-oriented tools) | Not known to index Indian Standards | Not known for IS sections | Not known | Paid B2B |
| **ManakMitra** | **Yes — 28 IS, 122 retrieved chunks** | **Yes — every answer cites IS + section; 97.8% verified by `scripts/eval_rag.py`** | **22 Indian languages** | **Free** |

## What we do NOT claim

- We do not claim no competitor exists anywhere — we claim none of the
  free, general-purpose tools *retrieves and cites indexed IS text*, which
  is what the problem statement asks for.
- We are not affiliated with BIS. Standard text is sourced from publicly
  available BIS publications; no data-provider agreement exists.

## Reproducing our side of the table

```bash
python scripts/eval_rag.py        # citation verification + abstention metrics
curl https://<backend>/api/stats  # corpus counts: 28 / 122 / 22 ...
```
