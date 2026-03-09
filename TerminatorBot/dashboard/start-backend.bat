@echo off
echo Starting TerminatorBot Dashboard Backend...
cd /d %~dp0backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt -q

echo.
echo Starting API server on http://localhost:8765
echo API Docs: http://localhost:8765/api/docs
echo.

uvicorn main:app --reload --port 8765
