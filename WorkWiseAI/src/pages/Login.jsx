import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/chatService'

export default function Login(){
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [area, setArea] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [serverOk, setServerOk] = useState(true)
	const [checking, setChecking] = useState(true)
	const navigate = useNavigate()

	async function submit(e){
		e.preventDefault()
		setError('')
		if(!email) return setError('Informe o email')
		if(!serverOk){
			return setError('Servidor indisponível. Aguarde reconexão ou reinicie o backend.')
		}
		setLoading(true)
		try{
			const { user } = await login(email, name, area)
			const merged = { ...user, name: name || user.name, area: area || user.area }
			localStorage.setItem('workwell_user', JSON.stringify(merged))
			navigate('/')
		}catch(err){
			console.error(err)
			const msg = (err?.message||'').toLowerCase().includes('failed to fetch')
				? 'Não consegui conectar ao servidor (rode: node server/chatapi.cjs na pasta server/ ou use npm run dev:server)'
				: 'Falha no login'
			setError(msg)
		}finally{
			setLoading(false)
		}
	}

	// Ping de saúde do backend
	useEffect(() => {
		let cancelled = false
		const API_BASE = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3002'
		async function ping(){
			setChecking(true)
			try{
				const res = await fetch(`${API_BASE}/ping`, { cache: 'no-store' })
				if(!res.ok) throw new Error('Ping status ' + res.status)
				const data = await res.json()
				if(!cancelled){
					setServerOk(!!data.ok)
					setChecking(false)
				}
			}catch(e){
				if(!cancelled){
					setServerOk(false)
					setChecking(false)
				}
			}
		}
		ping()
		const id = setInterval(ping, 5000) // re-tenta a cada 5s
		return () => { cancelled = true; clearInterval(id) }
	}, [])

	return (
		<div className="flex items-center justify-center min-h-screen">
			<form onSubmit={submit} className="bg-white/5 p-8 rounded-lg w-full max-w-md backdrop-blur space-y-4">
				<h2 className="text-2xl font-bold" style={{color:'var(--accent)'}}>Bem-vindo ao WorkWell</h2>
				{checking && <div className="text-xs text-white/50">Verificando servidor...</div>}
				{!serverOk && !checking && (
					<div className="text-sm text-red-300 bg-red-600/20 border border-red-600/30 rounded p-3">
						Servidor offline. Inicie em outro terminal:<br />
						<code className="text-xs">cd server &amp;&amp; node chatapi.cjs</code><br />
						Ou use <code className="text-xs">npm run dev:server</code> na raiz.
					</div>
				)}
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