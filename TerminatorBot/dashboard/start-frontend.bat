@echo off
echo Starting TerminatorBot Dashboard Frontend...
cd /d %~dp0frontend

if not exist node_modules (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting development server on http://localhost:3000
echo.

npm run dev
