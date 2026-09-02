@echo off
echo 🇮🇳 BIS Standards AI Assistant - Starting...
echo.

where python >nul 2>&1 && set PYTHON=python
where py >nul 2>&1 && set PYTHON=py -3

echo Using Python: %PYTHON%
%PYTHON% --version

where node >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
    exit /b 1
)
echo Using Node:
node --version

if not exist "venv" (
    echo 📦 Creating virtual environment...
    %PYTHON% -m venv venv
)

call venv\Scripts\activate.bat

echo 📦 Installing Python dependencies...
pip install -r backend\requirements.txt -q

if not exist ".env" if exist "config\.env.example" (
    copy config\.env.example .env >nul
    echo 📝 Created .env from example
)

echo 📦 Installing frontend dependencies...
cd frontend && npm install && cd ..

echo.
echo ✅ Setup complete!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  🚀 HOW TO START (choose one):
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  OPTION A: Gemini (Recommended — needs internet)
echo    1. Get free API key: https://aistudio.google.com/apikey
echo    2. Set GEMINI_API_KEY in .env file
echo    3. Run: python main.py (backend)
echo    4. Run: cd frontend ^&^& npm run dev (frontend)
echo.
echo  OPTION B: Ollama (Fully offline)
echo    1. Install: https://ollama.ai
echo    2. Run: ollama pull llama3.1
echo    3. Run: ollama serve
echo    4. Run: python main.py (backend)
echo    5. Run: cd frontend ^&^& npm run dev (frontend)
echo.
echo  OPTION C: No LLM (Just shows retrieved text)
echo    1. Run: python main.py
echo    2. Run: cd frontend ^&^& npm run dev
echo    System works but shows raw text instead of AI summary.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Open: http://localhost:3000
