// backend protegidos
const BASE = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3002';

export async function getSkillsForArea(area){
  try {
    const res = await fetch(`${BASE}/ai/skills`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ area })
    });
    if(!res.ok){
      // Erros de conexão ou 5xx
      throw new Error(`Falha ao gerar skills (status ${res.status})`);
    }
    return await res.json(); // { title, skills, warning? }
  } catch(err){
    // Fallback local quando backend indisponível
    const mockSkills = Array.from({length:6}).map((_,i)=>({
      id:`offline_${i}`,
      title:`Skill ${i+1}`,
      description:`Habilidade de exemplo para ${area}. (offline fallback)`
    }));
    return { title:`Habilidades (offline) em ${area}`, skills: mockSkills, warning:'Backend indisponível - exibindo fallback local', error: err.message };
  }
}

export async function getMotivationalReply({ name, area, text }){
  try {
    const res = await fetch(`${BASE}/ai/motivational`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, area, text })
    });
    if(!res.ok) throw new Error(`Falha ao gerar resposta (status ${res.status})`);
    const data = await res.json();
    return data.reply;
  } catch(err){
    return `Olá ${name||'colega'}! Recebi sua mensagem mas o serviço de IA está offline. Sugestão: escreva em uma nota 1 coisa que está ajudando e 1 coisa que está dificultando hoje; escolha uma micro-ação para avançar. (fallback local - ${err.message})`;
  }
}

export async function getMotivationalReplyWithHistory({ name, area, text, history, allUsers }){
  try {
    const res = await fetch(`${BASE}/ai/motivational-with-history`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, area, text, history, allUsers })
    });
    if(!res.ok) throw new Error(`Falha ao gerar resposta (status ${res.status})`);
    const data = await res.json();
    return data.reply;
  } catch(err){
    const sampleNames = (allUsers||[]).filter(u=>u?.name).slice(0,2).map(u=>u.name);
    const suggest = sampleNames.length ? ` Talvez conversar com ${sampleNames.join(' e ')} ajude.` : '';
    return `Força ${name||'colega'}! A IA está offline, mas você pode focar em uma ação pequena agora e pedir apoio na área ${area||'relevante'}.${suggest} (fallback local - ${err.message})`;
  }
}

export default { getSkillsForArea, getMotivationalReply, getMotivationalReplyWithHistory };
