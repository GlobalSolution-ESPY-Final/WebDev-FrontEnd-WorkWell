const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de banco de dados (na raiz do projeto WorkWiseAI)
const DB_PATH = path.join(process.cwd(), 'chatdb.json');

function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading DB:', e);
  }
  return { users: [], messages: [] };
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing DB:', e);
  }
}

const crypto = require('crypto');
function avatarForEmail(email) {
  const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=128`;
}

module.exports = { readDB, writeDB, avatarForEmail };
