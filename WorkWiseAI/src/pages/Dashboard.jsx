import React from 'react'
import Nav from '../components/Nav'
import { Link } from 'react-router-dom'


export default function Dashboard(){
const user = JSON.parse(localStorage.getItem('workwell_user'))
return (
<div>
<Nav />
<header className="p-8">
<h1 className="text-3xl font-bold">Olá, {user?.name}</h1>
<p className="mt-2 text-sm text-white/70">Área: {user?.area}</p>
</header>


<main className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
<Link to="/skills" className="p-6 rounded-lg bg-white/5 hover:scale-105 transition">
<h3 className="font-bold">Habilidades para o Futuro</h3>
<p className="text-sm mt-2">Sugestões de habilidades baseadas na sua área.</p>
</Link>


<Link to="/motivational" className="p-6 rounded-lg bg-white/5 hover:scale-105 transition">
<h3 className="font-bold">Conversa Motivacional</h3>
<p className="text-sm mt-2">Escreva como se sente e receba uma resposta personalizada.</p>
</Link>


<Link to="/networking" className="p-6 rounded-lg bg-white/5 hover:scale-105 transition">
<h3 className="font-bold">Networking</h3>
<p className="text-sm mt-2">Conheça pessoas influentes e troque ideias.</p>
</Link>
</main>
</div>
)
}