import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [pass, setPass] = useState('')
  const nav = useNavigate()
  const ADMIN = import.meta.env.VITE_ADMIN_PASSWORD || 'crowscrows'

  function onSubmit(e) {
    e.preventDefault()
    if (pass === ADMIN) {
      sessionStorage.setItem('crows_admin', '1')
      nav('/admin')
    } else {
      alert('Senha inválida')
    }
  }

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
        <button className="mt-4 w-full p-3 rounded bg-blood text-white">Entrar</button>
      </form>
    </div>
  )
}
