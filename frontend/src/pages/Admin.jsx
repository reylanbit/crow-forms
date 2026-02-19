import { useEffect, useMemo, useState } from 'react'
import { getMembers, getResponses } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('crows_admin') === '1')
  const [pass, setPass] = useState('')
  const [members, setMembers] = useState([])
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authed) return
    Promise.all([getMembers(), getResponses()]).then(([m, r]) => {
      setMembers(m || [])
      setResponses(r || [])
    }).finally(() => setLoading(false))
  }, [authed])

  const stats = useMemo(() => {
    const quintaSim = responses.filter((r) => r.quinta === 'a').length
    const sabadoSim = responses.filter((r) => r.sabado === 'a').length
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
    return { quintaSim, sabadoSim, totalMembers: members.length, totalRes: responses.length, mediaRes, dist }
  }, [members, responses])

  function onSubmit(e) {
    e.preventDefault()
    const ADMIN = import.meta.env.VITE_ADMIN_PASSWORD || 'crowscrows'
    if (pass === ADMIN) {
      sessionStorage.setItem('crows_admin', '1')
      setAuthed(true)
      setLoading(true)
    } else {
      alert('Senha inválida')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={onSubmit} className="glass p-8 rounded-xl border border-neutral-700 w-full max-w-sm">
          <h1 className="text-2xl font-gothic text-gold mb-4">Admin</h1>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Senha"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
            required
          />
          <button className="mt-4 w-full p-3 rounded bg-gold text-black">Entrar</button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-gothic text-gold">Painel Admin</h1>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded bg-blood text-white"
            onClick={() => {
              const base = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
              window.open(`${base}/api/members/export`, '_blank')
            }}
          >
            Exportar CSV
          </button>
          <button
            className="px-3 py-2 rounded bg-neutral-700 text-white"
            onClick={() => {
              sessionStorage.removeItem('crows_admin')
              setAuthed(false)
              window.dispatchEvent(new Event('crows_session_update'))
            }}
          >
            Sair
          </button>
        </div>
      </div>
      {loading && <div className="mt-3">Carregando...</div>}
      {!loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Total de Membros</div>
              <div className="text-2xl">{stats.totalMembers}</div>
            </div>
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Total de Respostas</div>
              <div className="text-2xl">{stats.totalRes}</div>
            </div>
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Quinta (Sim)</div>
              <div className="text-2xl">{stats.quintaSim}</div>
            </div>
            <div className="glass p-4 rounded border border-neutral-700">
              <div>Sábado (Sim)</div>
              <div className="text-2xl">{stats.sabadoSim}</div>
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
            <h2 className="text-xl mb-2">Últimas Respostas</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Nome</th>
                  <th className="p-2">Nick</th>
                  <th className="p-2">Quinta</th>
                  <th className="p-2">Sábado</th>
                  <th className="p-2">Classe</th>
                  <th className="p-2">Ressonância</th>
                </tr>
              </thead>
              <tbody>
                {responses.slice(-20).reverse().map((r, i) => (
                  <tr key={i} className="border-t border-neutral-800">
                    <td className="p-2">{r.nome}</td>
                    <td className="p-2">{r.nick}</td>
                    <td className="p-2">{r.quinta === 'a' ? 'Sim' : r.quinta === 'b' ? 'Não' : 'Justificou'}</td>
                    <td className="p-2">{r.sabado === 'a' ? 'Sim' : r.sabado === 'b' ? 'Não' : 'Justificou'}</td>
                    <td className="p-2">{r.classe}</td>
                    <td className="p-2">{r.ressonancia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
