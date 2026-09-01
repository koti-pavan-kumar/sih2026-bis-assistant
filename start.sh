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
echo "Next steps:"
echo "  1. Start Ollama: ollama serve"
echo "  2. Start backend: source venv/Scripts/activate && python main.py"
echo "  3. Start frontend: cd frontend && npm run dev"
echo ""
echo "Open: http://localhost:3000"
