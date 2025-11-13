import React, { useState } from 'react'
import Nav from '../components/Nav'
import { getSkillsForArea } from '../services/ai'


export default function Skills(){
const user = JSON.parse(localStorage.getItem('workwell_user'))
const [loading, setLoading] = useState(false)
const [skills, setSkills] = useState([])


async function fetchSkills(){
setLoading(true)
try{
const res = await getSkillsForArea(user.area)
setSkills(res)
}catch(e){
alert('Erro ao buscar habilidades: '+e.message)
}finally{setLoading(false)}
}


return (
<div>
<Nav />
<div className="p-8">
<h2 className="text-2xl font-bold">Habilidades recomendadas</h2>
<p className="text-sm text-white/70">Área: {user.area}</p>


<div className="mt-4">
<button onClick={fetchSkills} className="px-4 py-2 rounded" style={{background:'var(--accent)'}}>Gerar recomendações</button>
</div>


{loading && <p className="mt-4">Carregando...</p>}

{skills.title && (
<div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 mb-6">
<h3 className="text-xl font-bold text-blue-300">{skills.title}</h3>
</div>
)}

<ul className="mt-4 space-y-3">
{skills.skills && skills.skills.map((s,idx)=> (
<li key={idx} className="p-3 bg-white/5 rounded">
<div className="font-bold">{s.title}</div>
<div className="text-sm text-white/70">{s.description}</div>
</li>
))}
</ul>
</div>
</div>
)
}