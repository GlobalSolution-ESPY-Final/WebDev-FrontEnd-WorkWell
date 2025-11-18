# 🚀 Guia Rápido - WorkWell

## Como Iniciar o Projeto

### ✅ Opção 1: Script Automático (Windows)
**Clique duplo em:** `start-dev.bat`

Abre 2 janelas automaticamente:
- Backend (porta 3002)
- Frontend Vite (porta 5173+)

---

### ✅ Opção 2: Comando npm
```bash
npm start
```

Inicia backend + frontend juntos no mesmo terminal.

---

### ✅ Opção 3: Manual (2 terminais)
**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## 🤖 Ativar IA do Gemini (Opcional)

**SEM chave API**: Sistema funciona normalmente com dados mockados ✅

**COM chave API**: IA real responde recomendações personalizadas 🧠

### Como configurar:

1. **Obtenha chave gratuita:**
   https://makersuite.google.com/app/apikeys

2. **Edite** `server/.env`:
   ```env
   # Descomente e cole sua chave:
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. **Reinicie o backend** (Ctrl+C e rodar novamente)

---

## 📍 Acesso

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3002
- **Health Check:** http://localhost:3002/ping

---

## 🔧 Solução de Problemas

### Erro: "ERR_CONNECTION_REFUSED"
→ Backend não está rodando. Execute `npm run server` ou `start-backend.bat`

### Erro: "Port already in use"
→ Mate processos Node: `Stop-Process -Name node -Force` (PowerShell)

### IA retorna dados genéricos
→ Normal! Configure GEMINI_API_KEY no arquivo `.env` para ativar IA real

---

## 📦 Primeira Vez?

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar tudo
npm start

# 3. Abrir navegador
# http://localhost:5173
```

---

## 👤 Login de Teste

Use qualquer email do arquivo `server/chatdb.json`:
- ana@example.com
- bruno@example.com
- carla@example.com

(Não precisa senha real, é só mock)
