import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function Nav(){
const navigate = useNavigate()
const user = JSON.parse(localStorage.getItem('workwell_user') || 'null')


function logout(){
localStorage.removeItem('workwell_user')
navigate('/login')
}


return (
<nav className="sticky top-0 z-40 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between shadow-lg">
<div className="flex items-center gap-6">
<div className="font-bold text-2xl" style={{color:'var(--accent)'}}>WorkWell</div>
<div className="hidden md:flex items-center gap-1">
<Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Dashboard</Link>
<Link to="/skills" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Habilidades</Link>
<Link to="/motivational" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Motivação</Link>
<Link to="/networking" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Networking</Link>
</div>
</div>

<div className="flex items-center gap-4">
<div className="text-sm text-white/70">
  <span className="font-semibold text-white">{user?.name ?? 'Usuário'}</span>
  <span className="text-white/50 ml-1">({user?.area ?? 'N/A'})</span>
</div>
<button 
  onClick={logout} 
  className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/40 border border-red-600/30 transition-all duration-200 hover:shadow-lg font-semibold text-sm"
>
  Sair
</button>
</div>
</nav>
)
}