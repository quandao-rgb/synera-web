@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules\vite\bin\vite.js" (
  echo Chua cai dependency. Chay npm.cmd ci truoc.
  pause
  exit /b 1
)
echo Dang build giao dien SYNERA...
call npm.cmd run build:render
if errorlevel 1 (
  pause
  exit /b 1
)
echo SYNERA local: http://localhost:4182/
echo Giu cua so nay mo khi xem web. Nhan Ctrl+C de dung server.
call npm.cmd run dev:local
if errorlevel 1 pause
