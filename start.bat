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
echo Next steps:
echo   1. Start Ollama: ollama serve
echo   2. Start backend: venv\Scripts\activate ^&^& python main.py
echo   3. Start frontend: cd frontend ^&^& npm run dev
echo.
echo Open: http://localhost:3000
