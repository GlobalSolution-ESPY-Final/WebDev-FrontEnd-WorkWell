🧠 WorkWell — Plataforma de Suporte, Habilidades, Networking e Colaboração Inteligente

Autores: [Mateus Saavedra, davi falção e Danilo Fernandes] RM: [563266, 561657, 561818]

Uma ferramenta moderna desenvolvida para ajudar trabalhadores a encontrarem novas habilidades, receberem apoio emocional via IA e construírem networking profissional de forma rápida e intuitiva.

🌟 Sobre o Projeto

O WorkWell foi criado com o objetivo de apoiar pessoas que desejam melhorar suas oportunidades profissionais, aprender novas habilidades e encontrar colaboradores ideais para trabalhar em futuros projetos.

A plataforma conta com:

✔️ Recomendação de Habilidades

O usuário recebe sugestões de competências úteis para sua carreira futura.

✔️ Chat com IA (Gemini)

Um chat integrado com a IA do Google Gemini, oferecendo suporte emocional, conversas sobre sentimentos e orientações personalizadas.

✔️ Networking entre usuários
✔️ Conversas Privadas + Contexto Global Anonimizado
✔️ Página "Minha Conta" com avatar (upload), bio, projetos e link principal
✔️ Recomendações de colegas (IA sugere pessoas de áreas solicitadas)
✔️ Navegação responsiva com menu hamburger mobile

Uma área dedicada para conectar trabalhadores entre si, permitindo criar rede profissional e encontrar parceiros para projetos.

🛠️ Tecnologias Utilizadas

React.js

JavaScript (ES6+)

Vite

React Router DOM (sistema de rotas)

TailwindCSS

Gemini API (Integração com IA)

Axios para requisições HTTP
Multer (upload de avatar) + Express (API interna)

## ⚙️ Configuração do Projeto (IMPORTANTE)

### 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Chave de API do Google Gemini ([obter aqui](https://makersuite.google.com/app/apikeys))

### 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/GlobalSolution-ESPY-Final/WebDev-FrontEnd-WorkWell.git
cd WebDev-FrontEnd-WorkWell/WorkWiseAI
```

2. **Instale as dependências**
```bash
npm install
```


3. **Configure as variáveis de ambiente**

**⚠️ IMPORTANTE:** Crie um arquivo `.env` na pasta `server/` (`WorkWiseAI/server/.env`) com a chave do Gemini:

```env
GEMINI_API_KEY=AIzaSyCAiruZOFcWHsVdtlMCj7fYaL0qav6QQ68
```

> **Nota:** Substitua `SUA_CHAVE_AQUI` pela sua chave de API do Google Gemini. Você pode obtê-la gratuitamente em: https://makersuite.google.com/app/apikeys

4. **Inicie o backend (em um terminal)**
```bash
cd server
node chatapi.cjs
```

O backend será iniciado em `http://localhost:3002`

5. **Inicie o frontend (em outro terminal)**
```bash
npm run dev
```

O frontend será iniciado em `http://localhost:5173`


### 🎯 Estrutura de Arquivos de Ambiente

```
WorkWiseAI/
├── .env.example           # Template das variáveis (não contém chaves reais)
└── server/
	└── .env               # Configurações do backend (contém GEMINI_API_KEY)
```

**⚠️ Os arquivos `.env` NÃO estão no repositório por questões de segurança. Você precisa criá-los manualmente.**

🚀 Funcionalidades Principais
🔹 Busca e recomendação de habilidades

O sistema ajuda o usuário a entender quais habilidades são mais adequadas para seu crescimento profissional.

🔹 Chat inteligente com IA

A IA Gemini pode:

Conversar sobre sentimentos

Ajudar em questões emocionais

Fornecer sugestões motivacionais

Tirar dúvidas sobre carreira e habilidades

🔹 Área de Networking

Veja e encontre outras pessoas para trabalhar em conjunto, filtrando por nome, email e propósito profissional.

🔹 Login por Email & Conversas Privadas

Login simples por email (nome e área opcionais). Cada usuário:
1. É salvo em `server/chatdb.json` com email, nome, área, avatar (identicon ou upload), bio opcional, projetos, link principal.
2. Possui sua própria "conversa" privada (campo `conversation` = email) – só ele vê suas mensagens.
3. A IA acessa TODO o histórico global anonimamente para gerar respostas mais empáticas.
4. Quando o usuário pede ajuda de uma área (ex: "preciso de alguém de TI"), a IA recomenda colegas daquela área.

📁 Persistência de Dados

Arquivo: `server/chatdb.json`
Estrutura:
```
{
	"users": [ { id, email, name, area, avatar, bio, projectsCount, mainProjectUrl, createdAt } ],
	"messages": [ { id, email, text, timestamp, conversation } ]
}
```

🧩 Endpoints do Backend (Express)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /login | Login/registro por email (cria se não existir) |
| POST | /message | Persiste mensagem em uma conversa (campo conversation) |
| GET | /history?conversation=<email?> | Histórico global ou filtrado por conversa |
| GET | /users | Lista usuários registrados |
| GET | /user?email=<email> | Obter perfil completo de um usuário |
| PUT | /user | Atualizar perfil (nome, área, avatar, bio, projetos, link principal) |
| POST | /upload/avatar | Upload de avatar (JPG/PNG/WEBP até 2MB) |

🧠 Prompt com Contexto & Recomendações de Colaboradores

As últimas ~40 mensagens globais (anonimizadas) são enviadas como exemplos para o modelo Gemini.
O prompt também inclui um diretório de usuários agrupados por área. Quando o usuário pede ajuda de uma área específica a IA responde, por exemplo:
"Recomendo conversar com Ana da área de TI" (até 2 sugestões).

🚀 Como Rodar

Abra dois terminais:
```
cd WorkWiseAI
node server/chatapi.cjs
```
Em outro terminal:
```
cd WorkWiseAI
npm run dev
```
Depois acesse: http://localhost:5173 (ou porta mostrada pelo Vite) e faça login usando seu email.

🛡️ Observação sobre Chave da IA
Defina `VITE_GEMINI_API_KEY` no arquivo `.env`.

💡 Próximos Passos Sugeridos
* Cache / paginação de histórico para IA.
* Status online dos usuários (recomendações mais precisas).
* Mensagens diretas entre usuários (chat peer-to-peer).
* Moderação / exclusão de mensagens (endpoint DELETE /message/:id).
* Internacionalização (i18n) e acessibilidade.
* Persistir uploads em storage externo (S3/Azure Blob).

