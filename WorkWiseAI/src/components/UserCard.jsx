import React from 'react'


export default function UserCard({user}){
return (
<div className="p-4 bg-white/5 rounded">
<div className="font-bold">{user.name}</div>
<div className="text-sm text-white/70">{user.role || 'Especialista'}</div>
<div className="mt-2">
<a href={`mailto:${user.email}?subject=Ideia%20de%20neg%C3%B3cio`} className="text-sm underline">Enviar e-mail</a>
</div>
</div>
)
}