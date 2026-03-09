@echo off
REM Bottom Bitch Specialist Spawner (Windows Batch version)
REM Simple wrapper to call PowerShell script
REM Usage: spawn-specialist.bat <specialist> <task>

if "%~1"=="" goto usage
if "%~2"=="" goto usage

powershell.exe -ExecutionPolicy Bypass -File "%~dp0spawn-specialist.ps1" -Specialist "%~1" -Task "%~2"
goto :eof

:usage
echo Usage: spawn-specialist.bat ^<specialist^> ^<task^>
echo.
echo Available specialists:
echo   codegen   - Code generation and implementation
echo   debugger  - Bug hunting and fixes
echo   devops    - Infrastructure and deployment
echo   research  - Information gathering and analysis
echo   vision    - Image/screenshot analysis
echo   writer    - Documentation and content creation
echo.
echo Example:
echo   spawn-specialist.bat codegen "Create Python script to parse JSON logs"
goto :eof
