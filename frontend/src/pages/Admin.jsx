import { useEffect, useMemo, useState } from 'react'
import { getMembers, getResponses, addMember } from '../services/api'
import { pickTCContacts } from '../services/contacts'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Admin() {
  const nav = useNavigate()
  const authed = sessionStorage.getItem('crows_admin') === '1'
  const [members, setMembers] = useState([])
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!authed) {
      nav('/login')
      return
    }
    Promise.all([getMembers(), getResponses()]).then(([m, r]) => {
      setMembers(m || [])
      setResponses(r || [])
      setLoading(false)
    })
  }, [authed, nav])

  const stats = useMemo(() => {
    const quinta = responses.filter((r) => String(r.quinta).startsWith('a')).length
    const sabado = responses.filter((r) => String(r.sabado).startsWith('a')).length
    const total = members.length
    const mediaRes = Math.round(
      responses.reduce((acc, r) => acc + Number(r.ressonancia || 0), 0) / (responses.length || 1)
    )
    const dist = []
    const bins = [0, 2000, 4000, 6000, 8000, 10000, 12000]
    for (let i = 0; i < bins.length - 1; i++) {
      const a = bins[i], b = bins[i + 1]
      const n = responses.filter((r) => Number(r.ressonancia || 0) >= a && Number(r.ressonancia || 0) < b).length
      dist.push({ range: `${a}-${b}`, n })
    }
    return { quinta, sabado, total, mediaRes, dist }
  }, [members, responses])

  function waLink(member) {
    const origin = import.meta.env.VITE_PUBLIC_URL || window.location.origin
    const url = `${origin}/formulario`
    const msg = `Olá! Por favor, preencha o formulário da Guerra das Sombras: ${url}`
    const num = String(member.telefone || '').replace(/\D/g, '')
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
  }

  async function onAddMember(e) {
    e.preventDefault()
    const res = await addMember({ nome: name, telefone: phone })
    if (res && res.ok) {
      setMembers((m) => [...m, { nome: name, telefone: phone }])
      setName('')
      setPhone('')
    }
  }

  function onImportCSV(evt) {
    const file = evt.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const lines = String(reader.result || '').split(/\r?\n/).filter(Boolean)
      for (const line of lines) {
        const [n, p] = line.split(',').map((s) => s?.trim())
        if (n && p) {
          await addMember({ nome: n, telefone: p })
          setMembers((m) => [...m, { nome: n, telefone: p }])
        }
      }
    }
    reader.readAsText(file)
  }

  function exportCSV() {
    const headers = ['nome', 'nick', 'quinta', 'sabado', 'classe', 'pet', 'ressonancia', 'tempo']
    const rows = [headers.join(',')]
    for (const r of responses) {
      rows.push(headers.map((h) => JSON.stringify(r[h] ?? '')).join(','))
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'respostas.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function syncContacts() {
    const picked = await pickTCContacts()
    for (const c of picked) {
      await addMember(c)
      setMembers((m) => [...m, { nome: c.nome, telefone: c.telefone }])
    }
  }

  if (!authed) return null

  return (
    <div className="p-6">
      <h1 className="text-3xl font-gothic text-gold">Painel</h1>
      {loading && <div>Carregando...</div>}
      {!loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Total de Membros</div>
              <div className="text-2xl">{stats.total}</div>
            </div>
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Confirmados Quinta</div>
              <div className="text-2xl">{stats.quinta}</div>
            </div>
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Confirmados Sábado</div>
              <div className="text-2xl">{stats.sabado}</div>
            </div>
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Média Ressonância</div>
              <div className="text-2xl">{stats.mediaRes}</div>
            </div>
          </div>

          <div className="glass p-4 rounded border border-neutral-700 mt-6">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={stats.dist}>
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="n" fill="#8B0000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 glass p-4 rounded border border-neutral-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Gerenciar Membros</h2>
              <div className="flex gap-2">
                <button onClick={syncContacts} className="p-2 rounded bg-neutral-700 text-white">Sincronizar Contatos</button>
                <button onClick={exportCSV} className="p-2 rounded bg-blood text-white">Exportar Respostas</button>
              </div>
            </div>
            <form onSubmit={onAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
              <input className="p-2 rounded bg-neutral-800 border border-neutral-700" placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} required />
              <input className="p-2 rounded bg-neutral-800 border border-neutral-700" placeholder="Telefone" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
              <button className="p-2 rounded bg-gold text-black">Adicionar</button>
            </form>
            <input type="file" accept=".csv" className="mt-2" onChange={onImportCSV} />
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Nome</th>
                  <th className="p-2">Telefone</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const responded = responses.some((r) => String(r.telefone||'') === String(m.telefone||''))
                  return (
                    <tr key={i} className="border-t border-neutral-800">
                      <td className="p-2">{m.nome}</td>
                      <td className="p-2">{m.telefone}</td>
                      <td className="p-2">{responded ? 'Respondeu' : 'Não respondeu'}</td>
                      <td className="p-2">
                        <a href={waLink(m)} target="_blank" rel="noreferrer" className="p-2 rounded bg-blood text-white">Enviar Lembrete</a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
