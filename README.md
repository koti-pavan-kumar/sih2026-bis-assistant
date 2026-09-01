# 🇮🇳 BIS Standards AI Assistant — ManakMitra

> An AI-powered conversational assistant for querying India's 20,000+ BIS standards in Hindi and English.

**SIH 2026 | Problem Statement: SIH26107 | Team Resonant**

## Features

- 🌐 **Hindi + English bilingual** — Ask in any language
- 📎 **Source-cited responses** — Every answer traced to exact IS clause
- 🔒 **Fully offline capable** — Ollama runs locally, zero internet needed
- 🧠 **Anti-hallucination** — Honestly says "I don't know" when context is insufficient
- 📊 **Confidence scoring** — Know how reliable each answer is

## Quick Start

```bash
# Setup
./start.sh          # Git Bash / Linux
start.bat           # Windows CMD

# Start servers
ollama serve                    # Terminal 1: Start Ollama
source venv/Scripts/activate && python main.py  # Terminal 2: Backend
cd frontend && npm run dev     # Terminal 3: Frontend

# Open http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TailwindCSS + Vite |
| Backend | Python FastAPI |
| Vector DB | FAISS (CPU) |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| LLM | Ollama (llama3.1) / Gemini 2.0 Flash |
| PDF Parsing | pdfplumber |
| NLP | langdetect + deep-translator |

## Architecture

```
User Query → Language Detection → Translation → Embedding → FAISS Search → Context Assembly → LLM → Cited Response
```
