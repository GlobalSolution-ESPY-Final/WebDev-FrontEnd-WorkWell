const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3001;
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

app.listen(PORT, () => {
  console.log(`✅ Chat API rodando em http://localhost:${PORT}`);
});
