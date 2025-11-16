const API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5175';

export async function login(email, name, area) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, area })
  });
  if (!res.ok) throw new Error('Erro ao logar');
  return res.json(); // { user }
}

export async function sendMessage(email, text, conversation) {
  const res = await fetch(`${API_URL}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, text, conversation })
  });
  if (!res.ok) throw new Error('Erro ao salvar mensagem');
  return res.json(); // { message }
}

export async function getHistory(conversation) {
  const url = new URL(`${API_URL}/history`);
  if(conversation) url.searchParams.set('conversation', conversation);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar histórico');
  return res.json(); // { users, messages }
}

export async function listUsers(){
  const res = await fetch(`${API_URL}/users`);
  if(!res.ok) throw new Error('Erro ao listar usuários');
  return res.json();
}

export async function getUser(email){
  const url = new URL(`${API_URL}/user`);
  url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  if(!res.ok) throw new Error('Erro ao buscar usuário');
  return res.json(); // { user }
}

export async function updateUser(profile){
  const res = await fetch(`${API_URL}/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if(!res.ok) throw new Error('Erro ao atualizar usuário');
  return res.json(); // { user }
}

export async function uploadAvatar(file){
  const fd = new FormData();
  fd.append('avatar', file);
  const res = await fetch(`${API_URL}/upload/avatar`, {
    method: 'POST',
    body: fd
  });
  if(!res.ok) throw new Error('Falha no upload do avatar');
  return res.json(); // { url, path }
}
