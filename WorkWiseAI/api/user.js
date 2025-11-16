const { readDB, writeDB } = require('./_db');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const db = readDB();

  // GET - buscar usuário por email
  if (req.method === 'GET') {
    const email = (req.query.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ error: 'Email obrigatório' });
    }
    
    const user = db.users.find(u => (u.email || '').toLowerCase() === email);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    return res.json({ user });
  }

  // PUT - atualizar perfil do usuário
  if (req.method === 'PUT') {
    const { email, name, area, avatar, bio, projectsCount, mainProjectUrl } = req.body || {};
    
    if (!email) {
      return res.status(400).json({ error: 'Email obrigatório' });
    }
    
    const idx = db.users.findIndex(u => (u.email || '').toLowerCase() === email.toLowerCase());
    if (idx === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const user = db.users[idx];
    if (typeof name === 'string') user.name = name;
    if (typeof area === 'string') user.area = area;
    if (typeof avatar === 'string') user.avatar = avatar;
    if (typeof bio === 'string') user.bio = bio.substring(0, 300);
    if (typeof projectsCount === 'number') user.projectsCount = Math.max(0, Math.floor(projectsCount));
    if (typeof mainProjectUrl === 'string') user.mainProjectUrl = mainProjectUrl;
    
    db.users[idx] = user;
    writeDB(db);
    
    return res.json({ user });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
