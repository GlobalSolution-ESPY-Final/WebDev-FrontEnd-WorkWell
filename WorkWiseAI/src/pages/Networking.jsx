import { useEffect, useState } from "react";
import Nav from "../components/Nav";

export default function Networking() {
  const [users, setUsers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expanded, setExpanded] = useState({}); // quais usuários mostram skills/hobbies
  const [liked, setLiked] = useState({}); // quais usuários foram curtidos

  useEffect(() => {
    fetch(import.meta.env.VITE_MOCKAPI_URL)
      .then(res => res.json())
      .then(data => {
        const filtered = data.map(user => {
          // skills/hobbies/academica podem vir como array ou string separada por vírgulas
          const rawSkills = user.skills ?? user.Skills ?? [];
          const rawHobbies = user.hobbies ?? user.Hobbies ?? [];
          const rawAcademica = user.academica ?? user.Academica ?? user.formacao ?? [];
          const skills = Array.isArray(rawSkills)
            ? rawSkills
            : (typeof rawSkills === 'string' ? rawSkills.split(',').map(s=>s.trim()).filter(Boolean) : []);
          const hobbies = Array.isArray(rawHobbies)
            ? rawHobbies
            : (typeof rawHobbies === 'string' ? rawHobbies.split(',').map(s=>s.trim()).filter(Boolean) : []);
          const academica = Array.isArray(rawAcademica)
            ? rawAcademica
            : (typeof rawAcademica === 'string' ? rawAcademica.split(',').map(s=>s.trim()).filter(Boolean) : []);

          return ({
            name: user.name,
            email: user.email,
            skills,
            hobbies,
            academica,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
          });
        });
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

                  {/* Ações */}
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSendEmail(user.email, user.name)}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${
                        hoveredIndex === index ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-white/5 text-blue-300 hover:bg-white/10'
                      }`}
                    >
                      ✉️ {hoveredIndex === index ? 'Email' : 'Conectar'}
                    </button>
                    <button
                      onClick={() => setExpanded(e => ({ ...e, [index]: !e[index] }))}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${expanded[index] ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-white/5 text-purple-300 hover:bg-white/10'}`}
                    >
                      {expanded[index] ? 'Ocultar' : 'Ver características'}
                    </button>
                  </div>

                  <div className="mt-2">
                    <button
                      disabled={liked[index]}
                      onClick={() => setLiked(l => ({ ...l, [index]: true }))}
                      className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition ${liked[index] ? 'bg-green-600 text-white' : 'bg-white/5 text-green-300 hover:bg-white/10'}`}
                    >
                      {liked[index] ? '👍 Curtido' : '👍 Curtir'}
                    </button>
                    {liked[index] && (
                      <p className="mt-2 text-xs text-green-400">usuário recomendado! obrigado pelo feedback</p>
                    )}
                  </div>

                  {/* Skills & Hobbies condicional */}
                  {expanded[index] && (
                    <div className={`mt-4 pt-4 border-t border-white/10 space-y-4`}>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.skills && user.skills.length > 0) ? user.skills.slice(0,6).map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">{s}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Hobbies</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.hobbies && user.hobbies.length > 0) ? user.hobbies.slice(0,6).map((h, i) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">{h}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Formação Acadêmica</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.academica && user.academica.length > 0) ? user.academica.slice(0,6).map((a, i) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">{a}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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

