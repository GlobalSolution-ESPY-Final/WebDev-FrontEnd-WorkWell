import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { getUser, updateUser, uploadAvatar } from '../services/chatService'

export default function Account(){
  const stored = JSON.parse(localStorage.getItem('workwell_user') || 'null')
  const email = stored?.email || stored?.name // fallback (legacy)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [form, setForm] = useState({
    email: email,
    name: stored?.name || '',
    area: stored?.area || '',
    avatar: stored?.avatar || '',
    bio: stored?.bio || '',
    projectsCount: stored?.projectsCount || 0,
    mainProjectUrl: stored?.mainProjectUrl || ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(stored?.avatar || '')

  useEffect(()=>{
    (async ()=>{
      if(!email){ setError('Usuário não encontrado'); setLoading(false); return }
      try{
        const { user } = await getUser(email)
        setForm(f => ({
          ...f,
          name: user.name || '',
          area: user.area || '',
          avatar: user.avatar || '',
          bio: user.bio || '',
          projectsCount: user.projectsCount || 0,
          mainProjectUrl: user.mainProjectUrl || ''
        }))
      }catch(e){
        // Pode ser novo usuário; manter dados locais
        console.warn('Perfil novo ou erro ao buscar:', e)
      }finally{
        setLoading(false)
      }
    })()
  }, [email])

  function onChange(e){
    const { name, value } = e.target
    if(name === 'bio'){
      setForm(prev => ({...prev, bio: value.slice(0,300)}))
    }else if(name === 'projectsCount'){
      const n = Number(value)
      setForm(prev => ({...prev, projectsCount: isNaN(n) ? 0 : Math.max(0, Math.floor(n))}))
    }else{
      setForm(prev => ({...prev, [name]: value}))
    }
  }

  function onAvatarSelect(e){
    const file = e.target.files?.[0]
    if(!file) { setAvatarFile(null); return }
    if(!file.type.startsWith('image/')){ setError('Selecione uma imagem válida'); return }
    setAvatarFile(file)
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  async function save(){
    setSaving(true)
    setError('')
    setOk('')
    try{
      let avatarUrl = form.avatar
      if(avatarFile){
        const uploaded = await uploadAvatar(avatarFile)
        avatarUrl = uploaded.url
      }
      const { user } = await updateUser({ ...form, avatar: avatarUrl })
      localStorage.setItem('workwell_user', JSON.stringify(user))
      setOk('Dados salvos com sucesso')
    }catch(e){
      console.error(e)
      setError('Falha ao salvar')
    }finally{
      setSaving(false)
      setTimeout(()=> setOk(''), 2000)
    }
  }

  if(loading){
    return (
      <div>
        <Nav />
        <div className="p-8">Carregando...</div>
      </div>
    )
  }

  return (
    <div>
      <Nav />
      <div className="p-8 max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold">Minha Conta</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white/5 rounded p-4 text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto border border-white/10 mb-3">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-black/30 flex items-center justify-center text-white/50 text-sm">Sem avatar</div>
                )}
              </div>
              <label className="block text-sm mb-2">Foto de avatar</label>
              <input type="file" accept="image/*" onChange={onAvatarSelect} className="w-full text-sm" />
              <div className="text-xs text-white/40 mt-2">Arquivos suportados: JPG, PNG, WEBP (até 2MB)</div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block mb-1 text-sm">Nome</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full p-2 rounded bg-black/30" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Área</label>
              <input name="area" value={form.area} onChange={onChange} className="w-full p-2 rounded bg-black/30" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Descrição do trabalho (máx. 300)</label>
              <textarea name="bio" value={form.bio} onChange={onChange} maxLength={300} className="w-full p-3 rounded bg-black/30 h-28" placeholder="Descreva seu trabalho, desafios, tecnologias, foco..." />
              <div className="text-xs text-white/50 text-right">{form.bio?.length || 0}/300</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm">Quantidade de projetos</label>
                <input name="projectsCount" type="number" value={form.projectsCount} onChange={onChange} className="w-full p-2 rounded bg-black/30" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Link do projeto principal</label>
                <input name="mainProjectUrl" value={form.mainProjectUrl} onChange={onChange} className="w-full p-2 rounded bg-black/30" placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded disabled:opacity-60" style={{background:'var(--accent)'}}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
          {ok && <span className="text-green-400 text-sm">{ok}</span>}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
      </div>
    </div>
  )
}
