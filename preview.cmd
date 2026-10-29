@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 22.12 or newer, then reopen this file.
  pause
  exit /b 1
)
if not exist "node_modules\.bin\vite.cmd" (
  call npm ci --cache "%TEMP%\neighbor-demo-npm-cache" --registry https://registry.npmjs.org
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo Starting the local demo at http://127.0.0.1:5173
echo Keep this window open. Press Ctrl+C to stop.
call npm run dev -- --open
pause
