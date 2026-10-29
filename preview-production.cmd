@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules\.bin\vite.cmd" (
  call npm ci --cache "%TEMP%\neighbor-demo-npm-cache" --registry https://registry.npmjs.org
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
call npm run build
if errorlevel 1 (
  pause
  exit /b 1
)
echo Production preview: http://127.0.0.1:4173
call npm run preview -- --open
pause
