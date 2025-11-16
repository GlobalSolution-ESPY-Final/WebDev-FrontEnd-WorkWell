import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import { getMotivationalReplyWithHistory } from '../services/geminiService'
import { sendMessage, getHistory, listUsers } from '../services/chatService'

export default function Motivational(){
	const user = JSON.parse(localStorage.getItem('workwell_user'))
	const [text, setText] = useState('')
	const [messages, setMessages] = useState([]) // histórico local mostrado
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

		// Carrega histórico inicial (somente a conversa do usuário atual)
	useEffect(()=>{
		(async ()=>{
			try{
					const userEmail = user.email || user.name
					const { messages: conv } = await getHistory(userEmail)
					setMessages(conv.slice(-40))
			}catch(e){
				console.error(e)
				setError('Falha ao carregar histórico')
			}
		})()
	}, [])

	async function send(){
		if(!text.trim()) return
		setLoading(true)
		setError('')
		try{
			const userEmail = user.email || user.name
			// salva mensagem do usuário na conversa dele
			await sendMessage(userEmail, text.trim(), userEmail)
			// pega histórico global (sem filtro) para contexto da IA
			const { messages: all } = await getHistory()
			// pega lista de todos os usuários para recomendações
			const { users } = await listUsers()
			// gera resposta usando histórico e lista de usuários
			const aiReply = await getMotivationalReplyWithHistory({
						name: user.name,
						area: user.area,
				text: text.trim(),
				history: all,
				allUsers: users
			})
					// salva resposta da IA na mesma conversa
					await sendMessage('ai@system', aiReply, userEmail)
					// recarrega somente a conversa do usuário
					const { messages: conv } = await getHistory(userEmail)
					setMessages(conv.slice(-40))
			setText('')
		}catch(e){
			console.error(e)
			setError('Erro ao enviar mensagem')
		}finally{
			setLoading(false)
		}
	}

	return (
		<div>
			<Nav />
			<div className="p-8 max-w-4xl">
				<h2 className="text-2xl font-bold">Conversa motivacional</h2>
				<p className="text-white/60 text-sm mt-1">Suas mensagens são privadas. A IA usa contexto de toda empresa (anonimizado) para respostas personalizadas.</p>
				<div className="mt-6 grid md:grid-cols-2 gap-6">
					<div>
						<textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Como você está se sentindo no trabalho?" className="w-full p-3 bg-black/30 rounded h-48 resize-none" />
						<div className="mt-4 flex items-center gap-3">
							<button onClick={send} disabled={!text || loading} className="px-5 py-2 rounded disabled:opacity-50" style={{background:'var(--accent)'}}>{loading? 'Enviando...':'Enviar'}</button>
							{error && <span className="text-red-400 text-sm">{error}</span>}
						</div>
					</div>
					<div className="max-h-72 overflow-auto space-y-3 bg-white/5 rounded p-4">
						{messages.map(m => (
							<div key={m.id || m.timestamp} className={`p-3 rounded text-sm ${m.email === 'ai@system' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-black/30 border border-white/10'}`}> 
								<div className="text-[10px] uppercase tracking-wide mb-1 opacity-60">{m.email === 'ai@system' ? '🤖 WorkWell AI' : 'Você'}</div>
								<div>{m.text}</div>
							</div>
						))}
						{messages.length === 0 && <div className="text-white/40 text-sm">Sua conversa privada com a WorkWell AI aparecerá aqui.</div>}
					</div>
				</div>
			</div>
		</div>
	)
}