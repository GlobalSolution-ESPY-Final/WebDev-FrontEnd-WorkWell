import { useEffect, useState } from "react";
import Nav from "../components/Nav";

export default function Networking() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expanded, setExpanded] = useState({}); // quais usuários mostram skills/hobbies
  const [liked, setLiked] = useState({}); // quais usuários foram curtidos
  const [filter, setFilter] = useState({ area: '', cidade: '', tecnologia: '' });
  const [theme, setTheme] = useState(() => localStorage.getItem('workwell_theme') || (document.body.classList.contains('theme-light') ? 'light' : 'dark'));

  useEffect(() => {
    fetch('/network-users.json')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(err => console.error('Erro ao carregar usuários:', err));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const next = e?.detail;
      if (next === 'light' || next === 'dark') setTheme(next);
    };
    window.addEventListener('workwell-theme-change', handler);
    return () => window.removeEventListener('workwell-theme-change', handler);
  }, []);

  useEffect(() => {
    let result = users;
    if (filter.area) {
      result = result.filter(u => u.area && u.area.toLowerCase().includes(filter.area.toLowerCase()));
    }
    if (filter.cidade) {
      result = result.filter(u => u.localizacao && u.localizacao.toLowerCase().includes(filter.cidade.toLowerCase()));
    }
    if (filter.tecnologia) {
      result = result.filter(u => Array.isArray(u.habilidadesTecnicas) && u.habilidadesTecnicas.some(t => t.toLowerCase().includes(filter.tecnologia.toLowerCase())));
    }
    setFilteredUsers(result);
  }, [filter, users]);

  const handleSendEmail = (email, name) => {
    window.location.href = `mailto:${email}?subject=Olá ${name}!&body=Gostaria de conectar com você profissionalmente.`;
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-blue-700' : ''}`}>
      <Nav />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-100">Networking Profissional</h1>
        {/* Filtros */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-center">
          <input
            type="text"
            placeholder="Filtrar por área"
            className="border rounded-lg px-3 py-2 text-sm w-48 text-gray-900 bg-white"
            value={filter.area}
            onChange={e => setFilter(f => ({ ...f, area: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Filtrar por cidade"
            className="border rounded-lg px-3 py-2 text-sm w-48 text-gray-900 bg-white"
            value={filter.cidade}
            onChange={e => setFilter(f => ({ ...f, cidade: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Filtrar por tecnologia"
            className="border rounded-lg px-3 py-2 text-sm w-48 text-gray-900 bg-white"
            value={filter.tecnologia}
            onChange={e => setFilter(f => ({ ...f, tecnologia: e.target.value }))}
          />
        </div>
        <div className="rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id || index}
                className="relative group bg-gradient-to-br from-blue-500/30 to-purple-500/20 rounded-xl shadow-lg p-6 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={user.avatar}
                      alt={user.nome || user.name}
                      className="w-20 h-20 rounded-full border-2 border-blue-400/50 shadow-lg ring-4 ring-blue-500/20"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-white group-hover:text-blue-300 transition-colors duration-300">
                    {user.nome || user.name}
                  </h3>
                  <p className="text-center text-sm text-white/80 mb-1">{user.cargo}</p>
                  <p className="text-center text-xs text-white/60 mb-1">{user.localizacao} • {user.area}</p>
                  {user.resumo && <p className="text-center text-xs text-white/70 mb-2">{user.resumo}</p>}
                  <div className={`overflow-hidden transition-all duration-300 ${hoveredIndex === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="text-center mb-4">
                      <p className="text-sm text-white/70 break-all">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => window.open(`mailto:${user.email}`)}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${hoveredIndex === index ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-white/5 text-blue-300 hover:bg-white/10'}`}
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
                  {expanded[index] && (
                    <div className={`mt-4 pt-4 border-t border-white/10 space-y-4`}>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Habilidades Técnicas</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.habilidadesTecnicas && user.habilidadesTecnicas.length > 0) ? user.habilidadesTecnicas.map((t, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100/30 rounded-full text-xs text-blue-900 border border-blue-300">{t}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.skills && user.skills.length > 0) ? user.skills.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">{s}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Hobbies</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.hobbies && user.hobbies.length > 0) ? user.hobbies.map((h, i) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">{h}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Formação Acadêmica</p>
                        <div className="flex flex-wrap gap-2">
                          {user.formacao ? <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">{user.formacao}</span> : <span className="text-xs text-white/50">—</span>}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Projetos</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.projetos && user.projetos.length > 0) ? user.projetos.map((p, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-100/30 rounded-full text-xs text-purple-900 border border-purple-300">{p}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Certificações</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.certificacoes && user.certificacoes.length > 0) ? user.certificacoes.map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100/30 rounded-full text-xs text-green-900 border border-green-300">{c}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Idiomas</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.idiomas && user.idiomas.length > 0) ? user.idiomas.map((i, idx) => (
                            <span key={idx} className="px-2 py-1 bg-yellow-100/30 rounded-full text-xs text-yellow-900 border border-yellow-300">{i}</span>
                          )) : (
                            <span className="text-xs text-white/50">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white/80 text-sm mb-1">Área de Interesse</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.areaInteresse && user.areaInteresse.length > 0) ? user.areaInteresse.map((a, idx) => (
                            <span key={idx} className="px-2 py-1 bg-pink-100/30 rounded-full text-xs text-pink-900 border border-pink-300">{a}</span>
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
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">Nenhum profissional encontrado...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

