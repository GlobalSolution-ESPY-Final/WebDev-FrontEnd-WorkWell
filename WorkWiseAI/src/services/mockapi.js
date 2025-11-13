import axios from "axios";

// Base URL do MockAPI (pegando do .env ou usando valor padrão)
const MOCKAPI_BASE = import.meta.env.VITE_MOCKAPI_URL || "https://68d33dafcc7017eec54652ba.mockapi.io/users";

// Função para buscar usuários (name e email)
export async function fetchMockUsers() {
  try {
    const res = await axios.get(MOCKAPI_BASE);
    // Retorna apenas name e email
    return res.data.map(user => ({
      name: user.name,
      email: user.email,
    }));
  } catch (error) {
    console.error("Erro ao buscar usuários do MockAPI:", error);
    return [];
  }
}
