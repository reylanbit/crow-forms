import { useEffect, useState } from 'react'
import { getHealth, getMembers, getResponses } from '../services/api'
import { Link } from 'react-router-dom'

export default function Public() {
  const [health, setHealth] = useState(null)
  const [summary, setSummary] = useState({ members: 0, responses: 0, quintaSim: 0, sabadoSim: 0 })

  useEffect(() => {
    getHealth().then(setHealth)
    Promise.all([getMembers(), getResponses()]).then(([m, r]) => {
      const members = Array.isArray(m) ? m.length : 0
      const responses = Array.isArray(r) ? r.length : 0
      const quintaSim = (Array.isArray(r) ? r : []).filter((x) => x.quinta === 'a').length
      const sabadoSim = (Array.isArray(r) ? r : []).filter((x) => x.sabado === 'a').length
      setSummary({ members, responses, quintaSim, sabadoSim })
    }).catch(() => {})
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-gothic text-gold">The Crows</h1>
      <p className="mt-2">Bem-vindo aos Corvos. Prepare-se para a Guerra das Sombras.</p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-4 rounded border border-neutral-700">
          <h2 className="text-xl mb-2">Acesso Membros</h2>
          <p>Faça login como membro para preencher o formulário.</p>
          <div className="mt-3 flex justify-center">
            <Link className="px-4 py-2 rounded bg-gold text-black" to="/login">Entrar como Corvo</Link>
          </div>
        </div>
        <div className="glass p-4 rounded border border-neutral-700">
          <h2 className="text-xl mb-2">Resumo</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-neutral-400">Membros</div>
              <div className="text-2xl">{summary.members}</div>
            </div>
            <div>
              <div className="text-neutral-400">Respostas</div>
              <div className="text-2xl">{summary.responses}</div>
            </div>
            <div>
              <div className="text-neutral-400">Quinta (Sim)</div>
              <div className="text-2xl">{summary.quintaSim}</div>
            </div>
            <div>
              <div className="text-neutral-400">Sábado (Sim)</div>
              <div className="text-2xl">{summary.sabadoSim}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <strong>Backend:</strong> {health?.status || '...'}
      </div>
    </div>
  )
}
