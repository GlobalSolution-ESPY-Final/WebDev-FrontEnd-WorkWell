import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Login(){
const [name, setName] = useState('')
const [area, setArea] = useState('')
const navigate = useNavigate()


function submit(e){
e.preventDefault()
const user = { name, area }
localStorage.setItem('workwell_user', JSON.stringify(user))
navigate('/')
}


return (
<div className="flex items-center justify-center min-h-screen">
<form onSubmit={submit} className="bg-white/5 p-8 rounded-lg w-full max-w-md backdrop-blur">
<h2 className="text-2xl font-bold mb-4" style={{color:'var(--accent)'}}>Bem-vindo ao WorkWell</h2>
<label className="block mb-2">Nome</label>
<input required value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 rounded bg-black/30 mb-4" />


<label className="block mb-2">Área de atuação (ex.: UX, Backend, Vendas)</label>
<input required value={area} onChange={e=>setArea(e.target.value)} className="w-full p-2 rounded bg-black/30 mb-4" />


<button className="w-full py-2 rounded" style={{background:'var(--accent)'}}>Entrar</button>
</form>
</div>
)
}