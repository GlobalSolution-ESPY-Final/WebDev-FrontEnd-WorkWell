# WorkWiseAI - Setup Guide

## Requisitos
- Node.js 16+
- npm
- Chave de API do Google Gemini

## 1. Obter sua chave de API do Gemini

1. Acesse: https://makersuite.google.com/app/apikeys
2. Clique em "Create API Key"
3. Copie a chave gerada

## 2. Configurar o projeto

### Opção A: Setup Automático (Recomendado - Windows PowerShell)
```powershell
cd C:\Users\FOTOGRAFIA\Downloads\worwise\WorkWiseAI
.\setup.ps1
```

Quando pedido, cole sua chave do Gemini.

### Opção B: Setup Manual

1. Abra `.env` e coloque sua chave:
```
VITE_AI_API_KEY=sua_chave_do_gemini_aqui
```

2. Inicie os servidores:
```powershell
# Terminal 1: Proxy
cd C:\Users\FOTOGRAFIA\Downloads\worwise\WorkWiseAI
npm run dev:server

# Terminal 2: App (novo terminal)
cd C:\Users\FOTOGRAFIA\Downloads\worwise\WorkWiseAI
npm run dev
```

Ou use o comando para iniciar ambos:
```powershell
npm run dev:all
```

## 3. Usar a aplicação

- Abra http://localhost:5173 no navegador
- Vá para "Skills" para testar geração de habilidades
- Vá para "Motivational" para gerar respostas motivacionais

## Estrutura

- `src/services/ai.js` - Cliente que chama o proxy
- `server/server.cjs` - Proxy que chama Gemini API (server-side)
- `.env` - Variáveis de ambiente (gitignored, não commitar)
- `.env.example` - Template de exemplo

## Troubleshooting

### Erro: "API key not configured"
- Certifique-se de que `.env` tem `VITE_AI_API_KEY=sua_chave`
- Reinicie o proxy: `npm run dev:server`

### Erro: 404 na requisição
- O modelo `gemini-pro` pode estar indisponível em sua região
- Tente mudar em `.env`: `VITE_AI_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`

### Porta 5175 já em uso
- Mude em `.env`: `PORT=5176` (ou qualquer porta disponível)
- Atualize também: `VITE_PROXY_URL=http://localhost:5176/api/generate`

