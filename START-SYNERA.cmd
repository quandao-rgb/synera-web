@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules\vinext\dist\cli.js" (
  echo Chua cai dependency. Xem README.md va chay npm.cmd run install:ci truoc.
  pause
  exit /b 1
)
echo SYNERA local preview: http://127.0.0.1:4177/
echo Giu cua so nay mo khi xem web. Nhan Ctrl+C de dung server.
call npm.cmd run dev -- --port 4177 --host 127.0.0.1
