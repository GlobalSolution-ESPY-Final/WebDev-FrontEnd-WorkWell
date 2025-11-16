import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/chatService'

export default function Login(){
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [area, setArea] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const navigate = useNavigate()

	async function submit(e){
		e.preventDefault()
		setError('')
		if(!email) return setError('Informe o email')
		setLoading(true)
		try{
			const { user } = await login(email, name, area)
			const merged = { ...user, name: name || user.name, area: area || user.area }
			localStorage.setItem('workwell_user', JSON.stringify(merged))
			navigate('/')
		}catch(err){
			console.error(err)
			setError('Falha no login')
		}finally{
			setLoading(false)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<form onSubmit={submit} className="bg-white/5 p-8 rounded-lg w-full max-w-md backdrop-blur space-y-4">
				<h2 className="text-2xl font-bold" style={{color:'var(--accent)'}}>Bem-vindo ao WorkWell</h2>
						<div>
							<label className="block mb-1">Email</label>
							<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 rounded bg-black/30" placeholder="seuemail@empresa.com" />
							<div className="text-xs text-white/40 mt-1">Se o email já existir, você entra automaticamente.</div>
						</div>
				<div>
					<label className="block mb-1">Nome (opcional)</label>
					<input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 rounded bg-black/30" />
				</div>
				<div>
					<label className="block mb-1">Área de atuação (ex.: UX, Backend, Vendas)</label>
					<input value={area} onChange={e=>setArea(e.target.value)} className="w-full p-2 rounded bg-black/30" />
				</div>
				{error && <div className="text-red-400 text-sm">{error}</div>}
				<button disabled={loading} className="w-full py-2 rounded disabled:opacity-60" style={{background:'var(--accent)'}}>{loading? 'Entrando...':'Entrar'}</button>
			</form>
		</div>
	)
}