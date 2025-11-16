import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function Nav(){
const navigate = useNavigate()
const user = JSON.parse(localStorage.getItem('workwell_user') || 'null')
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


function logout(){
localStorage.removeItem('workwell_user')
navigate('/login')
setMobileMenuOpen(false)
}


return (
<nav className="sticky top-0 z-40 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-md border-b border-white/10 shadow-lg">
<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-6">
<div className="font-bold text-2xl" style={{color:'var(--accent)'}}>WorkWell</div>
<div className="hidden md:flex items-center gap-1">
<Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Dashboard</Link>
<Link to="/skills" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Habilidades</Link>
<Link to="/motivational" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Motivação</Link>
<Link to="/networking" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Networking</Link>
<Link to="/account" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 hover:text-blue-300">Minha Conta</Link>
</div>
</div>

<div className="flex items-center gap-4">
<div className="hidden sm:block text-sm text-white/70">
  <span className="font-semibold text-white">{user?.name ?? 'Usuário'}</span>
  <span className="text-white/50 ml-1">({user?.area ?? 'N/A'})</span>
  {user?.email && <span className="block text-xs text-white/40 mt-0.5">{user.email}</span>}
</div>
<button 
  onClick={logout} 
  className="hidden md:block px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/40 border border-red-600/30 transition-all duration-200 hover:shadow-lg font-semibold text-sm"
>
  Sair
</button>
<button 
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
  aria-label="Menu"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {mobileMenuOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
</button>
</div>
</div>

{/* Mobile Menu */}
{mobileMenuOpen && (
<div className="md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 space-y-2">
  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">Dashboard</Link>
  <Link to="/skills" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">Habilidades</Link>
  <Link to="/motivational" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">Motivação</Link>
  <Link to="/networking" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">Networking</Link>
  <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">Minha Conta</Link>
  <div className="pt-2 mt-2 border-t border-white/10">
    <div className="px-4 py-2 text-sm text-white/70">
      <span className="font-semibold text-white">{user?.name ?? 'Usuário'}</span>
      <span className="text-white/50 ml-1">({user?.area ?? 'N/A'})</span>
      {user?.email && <div className="text-xs text-white/40 mt-1">{user.email}</div>}
    </div>
    <button 
      onClick={logout} 
      className="w-full mt-2 px-4 py-3 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/40 border border-red-600/30 transition-all duration-200 font-semibold text-sm"
    >
      Sair
    </button>
  </div>
</div>
)}
</nav>
)
}