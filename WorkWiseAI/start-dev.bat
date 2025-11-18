@echo off
echo ========================================
echo   WorkWell - Iniciando TUDO
echo ========================================
echo.
echo Este script vai abrir 2 janelas:
echo   1. Backend (porta 3002)
echo   2. Frontend (Vite - porta 5173+)
echo.
echo Mantenha AMBAS abertas enquanto trabalha!
echo.
pause

REM Iniciar backend em nova janela
start "WorkWell Backend" cmd /k "cd /d "%~dp0" && set GEMINI_API_KEY= && node server/chatapi.cjs"

REM Aguardar 3 segundos
timeout /t 3 /nobreak >nul

REM Iniciar frontend
echo.
echo Iniciando frontend Vite...
npm run dev

pause
