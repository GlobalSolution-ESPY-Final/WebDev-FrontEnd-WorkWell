const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  console.log('Ping recebido!');
  res.json({ ok: true, time: new Date().toISOString() });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ Servidor MÍNIMO rodando em http://localhost:${PORT}`);
  console.log('   Pressione Ctrl+C para encerrar.');
});

// Keepalive
setInterval(() => {}, 1 << 30);

console.log('Script minimal-test.cjs executado, aguardando requisições...');
