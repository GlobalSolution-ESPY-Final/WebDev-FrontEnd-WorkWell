// Upload de avatar usando Vercel Blob Storage ou base64 inline
// Para simplificar, vamos usar base64 data URLs por enquanto
// Em produção real, use Vercel Blob, S3, ou Cloudinary

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

  try {
    const { file, email } = req.body;
    
    if (!file || !email) {
      return res.status(400).json({ error: 'Arquivo e email obrigatórios' });
    }

    // Validar tamanho (2MB max)
    const sizeInBytes = (file.length * 3) / 4; // aprox size of base64
    if (sizeInBytes > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Arquivo muito grande (máx 2MB)' });
    }

    // Validar tipo de imagem
    if (!file.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Apenas imagens são permitidas' });
    }

    // Retornar data URL (armazenado inline)
    const url = file;
    
    res.json({ url, path: url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Erro no upload' });
  }
};
