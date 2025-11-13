import { useEffect, useState } from "react";
import Nav from "../components/Nav";

export default function Networking() {
  const [users, setUsers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_MOCKAPI_URL)
      .then(res => res.json())
      .then(data => {
        const filtered = data.map(user => ({
          name: user.name,
          email: user.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
        }));
        setUsers(filtered);
      })
      .catch(err => console.error('Erro ao carregar usuários:', err));
  }, []);

  const handleSendEmail = (email, name) => {
    window.location.href = `mailto:${email}?subject=Olá ${name}!&body=Gostaria de conectar com você profissionalmente.`;
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">🌐 Networking Profissional</h1>
            <p className="text-white/60 text-lg">Conecte-se com profissionais e expanda sua rede</p>
          </div>

          {/* Grid de Contatos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 transition-all duration-300 ease-out hover:shadow-2xl hover:border-blue-500/50 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background decorativo que muda ao hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />

                {/* Conteúdo */}
                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full border-2 border-blue-400/50 shadow-lg ring-4 ring-blue-500/20"
                    />
                  </div>

                  {/* Nome */}
                  <h3 className="text-xl font-bold text-center mb-2 text-white group-hover:text-blue-300 transition-colors duration-300">
                    {user.name}
                  </h3>

                  {/* Email - inicialmente oculto, aparece no hover */}
                  <div className={`overflow-hidden transition-all duration-300 ${hoveredIndex === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="text-center mb-4">
                      <p className="text-sm text-white/70 break-all">{user.email}</p>
                    </div>
                  </div>

                  {/* Botão de Contato */}
                  <button
                    onClick={() => handleSendEmail(user.email, user.name)}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      hoveredIndex === index
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                        : 'bg-white/5 text-blue-300 hover:bg-white/10'
                    }`}
                  >
                    <span>✉️</span>
                    {hoveredIndex === index ? 'Enviar Email' : 'Conectar'}
                  </button>

                  {/* Stats fictícios */}
                  <div className={`mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs text-white/60 transition-all duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-50'}`}>
                    <div>
                      <p className="font-semibold text-white/80">Conexões</p>
                      <p>{Math.floor(Math.random() * 500) + 50}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white/80">Endossos</p>
                      <p>{Math.floor(Math.random() * 100) + 10}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white/80">Ativo</p>
                      <p>Sim</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">Carregando profissionais...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

