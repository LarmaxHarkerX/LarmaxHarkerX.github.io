@echo off
cd /d "%~dp0"
call node_modules\.bin\astro.cmd preview --host 127.0.0.1 --port 4321
pause
