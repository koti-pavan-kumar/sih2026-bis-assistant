#!/bin/bash
echo "🇮🇳 BIS Standards AI Assistant - Starting..."
echo ""

PYTHON=""
for cmd in python3 python "py -3"; do
    if command -v $cmd &>/dev/null || eval "command -v $cmd" &>/dev/null; then
        PYTHON=$cmd
        break
    fi
done

if [ -z "$PYTHON" ]; then
    echo "❌ Python not found"
    exit 1
fi

echo "Using Python: $PYTHON"
$PYTHON --version

if ! command -v node &>/dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi
echo "Using Node: $(node --version)"

if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    $PYTHON -m venv venv
fi

source venv/Scripts/activate 2>/dev/null || source venv/bin/activate

echo "📦 Installing Python dependencies..."
pip install -r backend/requirements.txt -q

if [ ! -f ".env" ] && [ -f "config/.env.example" ]; then
    cp config/.env.example .env
    echo "📝 Created .env from example"
fi

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 🚀 HOW TO START (choose one):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo " OPTION A: Gemini (Recommended — needs internet)"
echo "   1. Get free API key: https://aistudio.google.com/apikey"
echo "   2. Set GEMINI_API_KEY in .env file"
echo "   3. Run: python main.py (backend)"
echo "   4. Run: cd frontend && npm run dev (frontend)"
echo ""
echo " OPTION B: Ollama (Fully offline)"
echo "   1. Install: https://ollama.ai"
echo "   2. Run: ollama pull llama3.1"
echo "   3. Run: ollama serve"
echo "   4. Run: python main.py (backend)"
echo "   5. Run: cd frontend && npm run dev (frontend)"
echo ""
echo " OPTION C: No LLM (Just shows retrieved text)"
echo "   1. Run: python main.py"
echo "   2. Run: cd frontend && npm run dev"
echo "   System works but shows raw text instead of AI summary."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Open: http://localhost:3000"
