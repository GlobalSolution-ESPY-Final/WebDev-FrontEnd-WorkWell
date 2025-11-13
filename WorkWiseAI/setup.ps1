# Setup script para WorkWiseAI
# Uso: .\setup.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  WorkWiseAI - Setup Automático" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✓ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "  Copie .env.example para .env" -ForegroundColor Yellow
    exit 1
}

# Prompt for API key
Write-Host ""
Write-Host "Você já tem uma chave de API do Gemini?" -ForegroundColor Yellow
Write-Host "Se não, acesse: https://makersuite.google.com/app/apikeys" -ForegroundColor Yellow
Write-Host ""

$apiKey = Read-Host "Cole sua chave de API do Gemini"

if (-not $apiKey) {
    Write-Host "Erro: Chave de API não fornecida" -ForegroundColor Red
    exit 1
}

# Update .env with API key
$envContent = Get-Content ".env" -Raw
$envContent = $envContent -replace 'VITE_AI_API_KEY=.*', "VITE_AI_API_KEY=$apiKey"
Set-Content ".env" $envContent

Write-Host ""
Write-Host "✓ Chave de API configurada em .env" -ForegroundColor Green
Write-Host ""

# Install dependencies if needed
Write-Host "Verificando dependências..." -ForegroundColor Cyan
npm install --silent

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Setup Concluído!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximas etapas:" -ForegroundColor Yellow
Write-Host "1. Inicie o proxy (Terminal 1):" -ForegroundColor White
Write-Host "   npm run dev:server" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Inicie o app (Terminal 2):" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ou use um único comando (ambos simultaneamente):" -ForegroundColor White
Write-Host "   npm run dev:all" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Abra: http://localhost:5173" -ForegroundColor White
Write-Host ""
