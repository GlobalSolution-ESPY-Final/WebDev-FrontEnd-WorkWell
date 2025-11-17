// backend protegidos
const BASE = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3002';

export async function getSkillsForArea(area){
  const res = await fetch(`${BASE}/ai/skills`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ area })
  });
  if(!res.ok) throw new Error('Falha ao gerar skills');
  return res.json(); // { title, skills }
}

export async function getMotivationalReply({ name, area, text }){
  const res = await fetch(`${BASE}/ai/motivational`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, area, text })
  });
  if(!res.ok) throw new Error('Falha ao gerar resposta');
  const data = await res.json();
  return data.reply;
}

export async function getMotivationalReplyWithHistory({ name, area, text, history, allUsers }){
  const res = await fetch(`${BASE}/ai/motivational-with-history`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, area, text, history, allUsers })
  });
  if(!res.ok) throw new Error('Falha ao gerar resposta');
  const data = await res.json();
  return data.reply;
}

export default { getSkillsForArea, getMotivationalReply, getMotivationalReplyWithHistory };
