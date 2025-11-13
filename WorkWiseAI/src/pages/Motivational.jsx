import React, { useState } from 'react'
import Nav from '../components/Nav'
import { getMotivationalReply } from '../services/ai'


export default function Motivational(){
const user = JSON.parse(localStorage.getItem('workwell_user'))
const [text, setText] = useState('')
const [reply, setReply] = useState(null)
const [loading, setLoading] = useState(false)


async function send(){
setLoading(true)
try{
const r = await getMotivationalReply({ name: user.name, area: user.area, text })
setReply(r)
}catch(e){
alert('Erro: '+e.message)
}finally{setLoading(false)}
}


return (
<div>
<Nav />
<div className="p-8 max-w-3xl">
<h2 className="text-2xl font-bold">Conversa motivacional</h2>
<textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Como você está se sentindo no trabalho?" className="w-full p-3 mt-4 bg-black/30 rounded h-40" />
<div className="mt-4">
<button onClick={send} disabled={!text || loading} className="px-4 py-2 rounded" style={{background:'var(--accent)'}}>{loading? 'Enviando...':'Enviar'}</button>
</div>


{reply && (
<div className="mt-6 p-4 bg-white/5 rounded">
<h4 className="font-bold">Resposta personalizada</h4>
<p className="mt-2 text-white/80">{reply}</p>
</div>
)}
</div>
</div>
)
}