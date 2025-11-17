/**
 * BACKEND - WorkWell Chat API
 * 
 * ⚠️ IMPORTANTE: Este arquivo requer um arquivo .env na pasta server/ com:
 * GEMINI_API_KEY=sua_chave_aqui
 * 
 * Obtenha sua chave em: https://makersuite.google.com/app/apikeys
 * Consulte o README.md para mais instruções de configuração.
 */

const express = require('express');
require('dotenv').config();
// Polyfill fetch for Node versions < 18
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3002;
const DB_PATH = path.join(__dirname, 'chatdb.json');

app.use(cors());
app.use(express.json());

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    return { users: [], messages: [] };
  }
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Gera avatar simples usando hash md5 (gravatar identicon)
const crypto = require('crypto');
function avatarForEmail(email){
  const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=128`;
}

// Login / registro por email (atualiza nome e área se enviados)
app.post('/login', (req, res) => {
  const { email, name, area } = req.body;
  if (!email) return res.status(400).json({ error: 'Email obrigatório' });
  const db = readDB();
  let user = db.users.find(u => u.email === email);
  if (!user) {
    user = {
      id: 'u_' + Date.now(),
      email,
      name: name || email.split('@')[0],
      area: area || '',
      avatar: avatarForEmail(email),
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
  } else {
    // Atualiza dados opcionais
    if (name) user.name = name;
    if (area) user.area = area;
    if (!user.avatar) user.avatar = avatarForEmail(email);
  }
  writeDB(db);
  res.json({ user });
});

// Salvar mensagem
app.post('/message', (req, res) => {
  const { email, text, conversation } = req.body;
  if (!email || !text) return res.status(400).json({ error: 'Email e texto obrigatórios' });
  const db = readDB();
  const msg = { id: 'm_' + Date.now(), email, text, timestamp: new Date().toISOString(), conversation: conversation || email };
  db.messages.push(msg);
  writeDB(db);
  res.json({ message: msg });
});

// Buscar histórico de mensagens (todas)
app.get('/history', (req, res) => {
  const db = readDB();
  const conversation = req.query.conversation;
  const allMessages = db.messages || [];
  const messages = conversation ? allMessages.filter(m => m.conversation === conversation) : allMessages;
  res.json({ users: db.users, messages });
});

// Lista de usuários
app.get('/users', (req, res) => {
  const db = readDB();
  res.json({ users: db.users });
});

// ===== Avatar Upload =====
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeName = 'avatar_' + Date.now() + ext;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Tipo de arquivo não suportado'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

app.post('/upload/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo ausente' });
  const relativePath = `/uploads/${req.file.filename}`;
  const absoluteUrl = `${req.protocol}://${req.get('host')}${relativePath}`;
  res.json({ url: absoluteUrl, path: relativePath });
});

// Buscar usuário por email
app.get('/user', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  if(!email) return res.status(400).json({ error: 'Email obrigatório' });
  const db = readDB();
  const user = db.users.find(u => (u.email || '').toLowerCase() === email);
  if(!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ user });
});

// Atualizar perfil do usuário
app.put('/user', (req, res) => {
  const { email, name, area, avatar, bio, projectsCount, mainProjectUrl } = req.body || {};
  if(!email) return res.status(400).json({ error: 'Email obrigatório' });
  const db = readDB();
  const idx = db.users.findIndex(u => (u.email || '').toLowerCase() === email.toLowerCase());
  if(idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  const user = db.users[idx];
  if(typeof name === 'string') user.name = name;
  if(typeof area === 'string') user.area = area;
  if(typeof avatar === 'string') user.avatar = avatar;
  if(typeof bio === 'string') user.bio = bio.substring(0, 300);
  if(typeof projectsCount === 'number') user.projectsCount = Math.max(0, Math.floor(projectsCount));
  if(typeof mainProjectUrl === 'string') user.mainProjectUrl = mainProjectUrl;
  db.users[idx] = user;
  writeDB(db);
  res.json({ user });
});

// ===================== Gemini AI Routes (server-side secure key) =====================
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_PRIMARY = 'gemini-2.0-flash';
const GEMINI_MODEL_FALLBACK = 'gemini-pro';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1/models';

async function geminiCall(prompt, model = GEMINI_MODEL_PRIMARY){
  if(!GEMINI_KEY) throw new Error('GEMINI_API_KEY ausente (.env)');
  const endpoint = `${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_KEY}`;
  const payload = {
    contents: [ { role: 'user', parts: [ { text: prompt } ] } ]
  };
  const res = await fetch(endpoint, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!res.ok){
    const err = await res.json().catch(()=>({error:{message:res.statusText}}));
    // fallback if model not found
    if(model === GEMINI_MODEL_PRIMARY && (err.error?.message||'').includes('not found')){
      return geminiCall(prompt, GEMINI_MODEL_FALLBACK);
    }
    throw new Error(err.error?.message || res.statusText);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if(!text) throw new Error('Resposta vazia do Gemini');
  return text;
}

// Gera habilidades para área
app.post('/ai/skills', async (req,res)=>{
  const { area } = req.body || {};
  if(!area) return res.status(400).json({ error: 'Área obrigatória' });
  const prompt = `Você é um assistente que gera 6 habilidades essenciais para alguém que trabalha em ${area}. Para cada habilidade, inclua um título curto e 1-2 frases explicando por que é importante. Formato: lista numerada simples.`;
  try {
    const raw = await geminiCall(prompt);
    const lines = raw.split('\n').map(l=>l.trim()).filter(Boolean);
    const titleLine = lines[0] || `Habilidades em ${area}`;
    const skillLines = lines.slice(1);
    const skills = skillLines.map((line,i)=>({
      id:`skill_${i}`,
      title:`Habilidade ${i+1}`,
      description: line.replace(/^\d+\.\s*/, '')
    }));
    return res.json({ title: titleLine.replace(/^\d+\.\s*/, ''), skills });
  } catch (e){
    console.error('Erro /ai/skills:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// Resposta motivacional simples
app.post('/ai/motivational', async (req,res)=>{
  const { name, area, text } = req.body || {};
  if(!text) return res.status(400).json({ error: 'Texto obrigatório' });
  const prompt = `Seja empático e encorajador. Responda para ${name||'Funcionário'}, que atua em ${area||'setor desconhecido'}. O usuário disse: "${text}". Faça uma resposta personalizada, prática e curta (3-6 frases) para ajudar a estabilizar seu emocional no trabalho.`;
  try {
    const reply = await geminiCall(prompt);
    return res.json({ reply });
  } catch(e){
    console.error('Erro /ai/motivational:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// Resposta motivacional com histórico e recomendação de colegas
app.post('/ai/motivational-with-history', async (req,res)=>{
  const { name, area, text, history, allUsers } = req.body || {};
  if(!text) return res.status(400).json({ error: 'Texto obrigatório' });
  const examples = (history||[])
    .filter(m=>m.email !== 'ai@system')
    .slice(-40)
    .map(m=>`Funcionário (área desconhecida): ${m.text}`)
    .join('\n');
  const usersByArea = (allUsers||[]).reduce((acc,u)=>{
    if(u.area && u.name){
      (acc[u.area] ||= []).push(u.name);
    }
    return acc;
  },{});
  const usersContext = Object.keys(usersByArea).length
    ? `\n\nUSUÁRIOS DISPONÍVEIS POR ÁREA:\n${Object.entries(usersByArea).map(([a,list])=>`- ${a}: ${list.join(', ')}`).join('\n')}`
    : '';
  const prompt = `Você é a WorkWell AI, assistente corporativa de bem-estar mental e integração entre setores.\nContexto anônimo:\n${examples}${usersContext}\n---\nFuncionario: ${name||'Sem nome'} | Área: ${area||'Desconhecida'} | Mensagem: "${text}"\nInstruções: Tom empático, 3-6 frases, 1 ação prática. Se pedir ajuda de área específica, recomende até 2 pessoas: "Recomendo conversar com [Nome] da área de [Área]". Não revele emails.`;
  try {
    const reply = await geminiCall(prompt);
    return res.json({ reply });
  } catch(e){
    console.error('Erro /ai/motivational-with-history:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// Inicia servidor após registrar todas as rotas
app.listen(PORT, () => {
  console.log(`✅ Chat API rodando em http://localhost:${PORT}`);
});