@echo off
echo ========================================
echo   WorkWell - Iniciando Backend
echo ========================================
echo.

REM Limpar variaveis de ambiente vazadas (chaves antigas que foram comprometidas)
REM Isso NAO apaga chaves novas validas do arquivo .env
set GEMINI_API_KEY=

REM Ir para pasta correta
cd /d "%~dp0"

echo Pasta atual: %CD%
echo.
echo Verificando porta 3002...
netstat -ano | findstr :3002
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [AVISO] Porta 3002 em uso! Pressione Ctrl+C para cancelar
    echo         ou ENTER para tentar iniciar mesmo assim.
    pause
)

echo.
echo Iniciando servidor backend...
echo (Mantenha esta janela ABERTA enquanto usa o app)
echo.
echo IMPORTANTE: Se quiser usar IA do Gemini:
echo   1. Obtenha chave em: https://makersuite.google.com/app/apikeys
echo   2. Edite server\.env e descomente: GEMINI_API_KEY=sua_chave_aqui
echo   3. Reinicie este script
echo.
echo Se nao tiver chave, o servidor vai usar respostas mockadas (sem IA).
echo.
echo Pressione Ctrl+C para encerrar o servidor.
echo ========================================
echo.

node server/chatapi.cjs

pause
