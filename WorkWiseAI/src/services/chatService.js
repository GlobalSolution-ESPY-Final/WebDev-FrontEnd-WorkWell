// Use /api routes for Vercel serverless functions
// In production, API_URL will be the same domain (relative /api)
// In development, it falls back to localhost
const API_URL = import.meta.env.VITE_CHAT_API_URL || (typeof window !== 'undefined' && window.location.origin) || 'http://localhost:3001';

export async function login(email, name, area) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, area })
  });
  if (!res.ok) throw new Error('Erro ao logar');
  return res.json(); // { user }
}

export async function sendMessage(email, text, conversation) {
  const res = await fetch(`${API_URL}/api/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, text, conversation })
  });
  if (!res.ok) throw new Error('Erro ao salvar mensagem');
  return res.json(); // { message }
}

export async function getHistory(conversation) {
  const url = new URL(`${API_URL}/api/history`);
  if(conversation) url.searchParams.set('conversation', conversation);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar histórico');
  return res.json(); // { users, messages }
}

export async function listUsers(){
  const res = await fetch(`${API_URL}/api/users`);
  if(!res.ok) throw new Error('Erro ao listar usuários');
  return res.json();
}

export async function getUser(email){
  const url = new URL(`${API_URL}/api/user`);
  url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  if(!res.ok) throw new Error('Erro ao buscar usuário');
  return res.json(); // { user }
}

export async function updateUser(profile){
  const res = await fetch(`${API_URL}/api/user`, {
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
        const res = await fetch(`${API_URL}/api/upload-avatar`, {
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
