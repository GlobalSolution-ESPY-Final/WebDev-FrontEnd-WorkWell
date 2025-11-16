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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, text, conversation } = req.body;
  
  if (!email || !text) {
    return res.status(400).json({ error: 'Email e texto obrigatórios' });
  }

  const db = readDB();
  const msg = {
    id: 'm_' + Date.now(),
    email,
    text,
    timestamp: new Date().toISOString(),
    conversation: conversation || email
  };
  
  db.messages.push(msg);
  writeDB(db);
  
  res.json({ message: msg });
};
