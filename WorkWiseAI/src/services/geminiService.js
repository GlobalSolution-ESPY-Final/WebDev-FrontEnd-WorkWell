/**
 * geminiService.js
 * Serviço para chamar a API do Google Gemini diretamente
 * Requer: VITE_GEMINI_API_KEY no .env
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

if (!API_KEY) {
  console.error('❌ VITE_GEMINI_API_KEY não está configurada no .env');
}

/**
 * Chama a API do Gemini com um prompt
 * @param {string} prompt - O texto a enviar para o Gemini
 * @returns {Promise<string>} - A resposta do Gemini
 */
async function callGemini(prompt) {
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY não configurada');
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro da API Gemini:', error);
      
      // Se o modelo não existe, tenta com outro
      if (error.error?.message?.includes('not found')) {
        console.warn('⚠️  Modelo não disponível, tentando com gemini-pro...');
        return callGeminiWithFallback(prompt);
      }
      
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Nenhuma resposta válida do Gemini');
    }

    return text;
  } catch (error) {
    console.error('❌ Erro ao chamar Gemini:', error.message);
    throw error;
  }
}

/**
 * Função auxiliar com fallback para gemini-pro
 */
async function callGeminiWithFallback(prompt) {
  const fallbackEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
  
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`${fallbackEndpoint}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Nenhuma resposta válida do Gemini');
    }

    return text;
  } catch (error) {
    console.error('❌ Fallback também falhou:', error.message);
    throw error;
  }
}

/**
 * Gera 6 habilidades essenciais para uma área específica
 * @param {string} area - A área de trabalho (ex: "Vendas", "TI", etc)
 * @returns {Promise<Array>} - Array de habilidades com título e descrição
 */
export async function getSkillsForArea(area) {
  const prompt = `Você é um assistente que gera 6 habilidades essenciais para alguém que trabalha em ${area}. 
Para cada habilidade, inclua um título curto e 1-2 frases explicando por que é importante.
Formato: Retorne como uma lista numerada simples.`;

  try {
    const text = await callGemini(prompt);
    
    // Parsear a resposta em array de objetos
    const lines = text.split('\n').filter(line => line.trim());
    
    // A primeira linha é o título, as demais são as habilidades
    const titleLine = lines[0];
    const skillLines = lines.slice(1);
    
    const skills = skillLines.map((line, i) => ({
      id: `skill_${i}`,
      title: `Habilidade ${i + 1}`,
      description: line.replace(/^\d+\.\s*/, '') // Remove numeração
    }));

    return {
      title: titleLine.replace(/^\d+\.\s*/, ''), // Remove numeração se houver
      skills: skills
    };
  } catch (error) {
    console.error('Erro ao gerar skills:', error);
    throw error;
  }
}

/**
 * Gera uma resposta motivacional personalizada
 * @param {Object} params - { name, area, text }
 * @returns {Promise<string>} - Resposta motivacional
 */
export async function getMotivationalReply({ name, area, text }) {
  const prompt = `Seja empático e encorajador. Responda para ${name}, que atua em ${area}. 
O usuário disse: "${text}". 
Faça uma resposta personalizada, prática e curta (3-6 frases) para ajudar a estabilizar seu emocional no trabalho.`;

  try {
    const response = await callGemini(prompt);
    return response;
  } catch (error) {
    console.error('Erro ao gerar resposta motivacional:', error);
    throw error;
  }
}

/**
 * Versão estendida que inclui histórico de mensagens de vários usuários como contexto.
 * @param {Object} params - { name, area, text, history, allUsers }
 * history: Array<{email,text}> das últimas mensagens globais
 * allUsers: Array<{name,area,email}> todos usuários registrados
 */
export async function getMotivationalReplyWithHistory({ name, area, text, history, allUsers }) {
  const examples = (history || [])
    .filter(m => m.email !== 'ai@system') // Remove respostas da IA do contexto
    .slice(-40)
    .map(m => `Funcionário (área desconhecida): ${m.text}`) // Anonimiza
    .join('\n');

  // Lista de usuários por área (para recomendações)
  const usersByArea = (allUsers || []).reduce((acc, u) => {
    if (u.area && u.name) {
      if (!acc[u.area]) acc[u.area] = [];
      acc[u.area].push({ name: u.name, email: u.email });
    }
    return acc;
  }, {});

  const availableAreas = Object.keys(usersByArea).join(', ');
  
  const usersContext = availableAreas 
    ? `\n\nUSUÁRIOS DISPONÍVEIS POR ÁREA:\n${Object.entries(usersByArea).map(([area, users]) => 
        `- ${area}: ${users.map(u => u.name).join(', ')}`
      ).join('\n')}`
    : '';

  const prompt = `Você é a WorkWell AI, uma assistente corporativa profissional focada em bem-estar mental e integração entre setores da empresa.

SEU PROPÓSITO:
- Apoiar emocionalmente funcionários de todas as áreas
- Facilitar comunicação entre departamentos
- Promover saúde mental no ambiente corporativo
- Oferecer orientações práticas e profissionais
- RECOMENDAR USUÁRIOS de áreas específicas quando o funcionário mencionar precisar de ajuda

CONTEXTO ANÔNIMO DE OUTROS FUNCIONÁRIOS (use para entender clima organizacional):
${examples}
${usersContext}

---
FUNCIONÁRIO ATUAL:
Nome: ${name}
Área: ${area}
Mensagem: "${text}"

INSTRUÇÕES DE RESPOSTA:
1. Tom profissional mas empático e acolhedor
2. 3-6 frases objetivas
3. Ofereça 1 ação prática aplicável no trabalho
4. **IMPORTANTE**: Se o funcionário mencionar precisar de ajuda de uma área específica (ex: TI, RH, Vendas, Design, etc), RECOMENDE usuários dessa área usando o formato:
   "Recomendo conversar com [Nome] da área de [Área]"
5. Se houver múltiplos usuários da área mencionada, sugira até 2 pessoas
6. Mantenha foco em saúde mental corporativa e integração entre áreas
7. Nunca revele emails ou dados sensíveis`;

  try {
    const response = await callGemini(prompt);
    return response;
  } catch (error) {
    console.error('Erro ao gerar resposta motivacional com histórico:', error);
    throw error;
  }
}

/**
 * Gera uma sugestão de menu (exemplo adicional)
 * @param {string} userPreference - Preferência do usuário
 * @returns {Promise<string>} - Sugestão
 */
export async function getMenuSuggestion(userPreference) {
  const prompt = `Baseado na preferência: "${userPreference}", sugira um menu saudável e equilibrado para a semana.`;

  try {
    const response = await callGemini(prompt);
    return response;
  } catch (error) {
    console.error('Erro ao gerar sugestão de menu:', error);
    throw error;
  }
}

export default {
  callGemini,
  getSkillsForArea,
  getMotivationalReply,
  getMenuSuggestion
};
