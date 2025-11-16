const { readDB, writeDB, avatarForEmail } = require('./_db');

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, area } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email obrigatório' });
  }

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
};
