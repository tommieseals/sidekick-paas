@echo off
echo ============================================
echo   TerminatorBot Dashboard Launcher
echo ============================================
echo.

echo Starting Backend API...
start "TerminatorBot API" cmd /c "cd /d %~dp0 && call start-backend.bat"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "TerminatorBot Frontend" cmd /c "cd /d %~dp0 && call start-frontend.bat"

echo.
echo Dashboard starting...
echo - API: http://localhost:8765
echo - Dashboard: http://localhost:3000
echo.
echo Opening dashboard in browser...
timeout /t 5 /nobreak > nul
start http://localhost:3000
