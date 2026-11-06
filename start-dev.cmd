@echo off
cd /d "%~dp0"
node_modules\.bin\node.exe scripts\content\sync.mjs
if errorlevel 1 exit /b 1
call node_modules\.bin\astro.cmd dev --host 127.0.0.1 --port 4321
pause
