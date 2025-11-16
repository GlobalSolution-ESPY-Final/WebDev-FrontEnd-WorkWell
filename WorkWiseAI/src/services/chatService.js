// Use /api routes for Vercel serverless functions
// In production, prefer relative path to avoid CORS and ignore localhost envs accidentally set
const envUrl = import.meta.env.VITE_CHAT_API_URL;
const isBrowser = typeof window !== 'undefined';
const hostname = isBrowser ? window.location.hostname : '';
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
// In production (not localhost), force relative base ('') even if VITE_CHAT_API_URL is set to localhost
const API_BASE = isBrowser && !isLocal
  ? ''
  : (envUrl || 'http://localhost:3001');

export async function login(email, name, area) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, area })
  });
  if (!res.ok) throw new Error('Erro ao logar');
  return res.json(); // { user }
}

export async function sendMessage(email, text, conversation) {
  const res = await fetch(`${API_BASE}/api/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, text, conversation })
  });
  if (!res.ok) throw new Error('Erro ao salvar mensagem');
  return res.json(); // { message }
}

export async function getHistory(conversation) {
  const url = new URL(`${API_BASE}/api/history`, isBrowser ? window.location.origin : undefined);
  if(conversation) url.searchParams.set('conversation', conversation);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar histórico');
  return res.json(); // { users, messages }
}

export async function listUsers(){
  const res = await fetch(`${API_BASE}/api/users`);
  if(!res.ok) throw new Error('Erro ao listar usuários');
  return res.json();
}

export async function getUser(email){
  const url = new URL(`${API_BASE}/api/user`, isBrowser ? window.location.origin : undefined);
  url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  if(!res.ok) throw new Error('Erro ao buscar usuário');
  return res.json(); // { user }
}

export async function updateUser(profile){
  const res = await fetch(`${API_BASE}/api/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if(!res.ok) throw new Error('Erro ao atualizar usuário');
  return res.json(); // { user }
}

export async function uploadAvatar(file){
  // Convert file to base64 for serverless upload
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const user = JSON.parse(localStorage.getItem('workwell_user') || '{}');
  const res = await fetch(`${API_BASE}/api/upload-avatar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, email: user.email })
        });
        if(!res.ok) throw new Error('Falha no upload do avatar');
        const data = await res.json();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}
