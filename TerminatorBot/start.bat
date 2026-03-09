@echo off
REM TerminatorBot - Production Startup Script
REM Location: C:\Users\tommi\clawd\TerminatorBot\start.bat

echo.
echo  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ████████╗ ██████╗ ██████╗
echo  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
echo     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║   ██║   ██║   ██║██████╔╝
echo     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║   ██║   ██║   ██║██╔══██╗
echo     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║   ██║   ╚██████╔╝██║  ██║
echo     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
echo.
echo  Global Prediction Market Exploitation System
echo.
echo  [PRODUCTION MODE]
echo.

cd /d C:\Users\tommi\clawd\TerminatorBot

echo Checking environment...
if not exist venv\ (
    echo ERROR: Virtual environment not found!
    echo Run: python -m venv venv
    pause
    exit /b 1
)

if not exist .env (
    echo ERROR: .env file not found!
    echo Copy .env.example to .env and configure
    pause
    exit /b 1
)

echo.
echo Starting TerminatorBot...
echo Mode: PAPER TRADING (Safe)
echo.
echo Commands:
echo   - Ctrl+C to stop
echo   - Check logs in data/
echo.

venv\Scripts\python.exe src/main.py --scan all --execute

echo.
echo TerminatorBot stopped.
pause
