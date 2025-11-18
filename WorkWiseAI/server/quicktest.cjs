// Servidor mínimo para diagnosticar ambiente Node/porta
const express = require('express');
const app = express();
app.get('/ping', (req,res)=> res.json({ ok:true, time: new Date().toISOString() }));
app.listen(3002, ()=> console.log('🔎 quicktest.cjs rodando em http://localhost:3002 (CTRL+C para sair)'));
