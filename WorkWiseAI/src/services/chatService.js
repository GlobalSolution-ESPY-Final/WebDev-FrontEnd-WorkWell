// crie um arquivo .env com a seguinte informação: GEMINI_API_KEY=AIzaSyBTSTGYe2Rye9yJDkIfcnetyQU49PiyQlw
const envUrl = import.meta.env.VITE_CHAT_API_URL;
const API_BASE = envUrl || 'http://localhost:3002';

export async function login(email, name, area) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, area })
  });
  if (!res.ok) throw new Error('Erro ao logar');
  return res.json(); // { user }
}

export async function sendMessage(email, text, conversation) {
  const res = await fetch(`${API_BASE}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, text, conversation })
  });
  if (!res.ok) throw new Error('Erro ao salvar mensagem');
  return res.json(); // { message }
}

export async function getHistory(conversation) {
  const isBrowser = typeof window !== 'undefined';
  const url = new URL(`${API_BASE}/history`);
  if(conversation) url.searchParams.set('conversation', conversation);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar histórico');
  return res.json(); // { users, messages }
}

export async function listUsers(){
  const res = await fetch(`${API_BASE}/users`);
  if(!res.ok) throw new Error('Erro ao listar usuários');
  return res.json();
}

export async function getUser(email){
  const url = new URL(`${API_BASE}/user`);
  url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  if(!res.ok) throw new Error('Erro ao buscar usuário');
  return res.json(); // { user }
}

export async function updateUser(profile){
  const res = await fetch(`${API_BASE}/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if(!res.ok) throw new Error('Erro ao atualizar usuário');
  return res.json(); // { user }
}

export async function uploadAvatar(file){
  // Multipart upload to local Express route
  const form = new FormData();
  form.append('avatar', file);
  const res = await fetch(`${API_BASE}/upload/avatar`, {
    method: 'POST',
    body: form
  });
  if(!res.ok) throw new Error('Falha no upload do avatar');
  return res.json(); // { url, path }
}
