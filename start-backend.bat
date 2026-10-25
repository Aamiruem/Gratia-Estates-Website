@echo off
rem Restarts the Gratia Estates backend (FastAPI on port 8000).
rem Double-click this file after updates so new features are loaded.
title Gratia Estates backend
cd /d "%~dp0backend"

echo Stopping any backend already running on port 8000...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":8000 .*LISTENING"') do (
  taskkill /PID %%p /F >nul 2>&1
)

if not exist ".venv\Scripts\python.exe" (
  echo Setting up the Python environment for the first time...
  py -3.12 -m venv .venv || python -m venv .venv
  ".venv\Scripts\python.exe" -m pip install -r requirements.txt
)

echo.
echo Starting the backend at http://localhost:8000  (keep this window open)
echo Owner sign-in codes will appear in this window until email is set up.
echo.
".venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
