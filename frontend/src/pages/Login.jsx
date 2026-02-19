import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const nav = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    sessionStorage.setItem('crows_member', '1')
    sessionStorage.setItem('member_name', name)
    sessionStorage.setItem('member_phone', phone)
    nav('/formulario')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="glass p-8 rounded-xl border border-neutral-700 w-full max-w-sm">
        <h1 className="text-2xl font-gothic text-gold mb-4">Entrar como Corvo</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome de guerra"
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 mb-3"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Seu WhatsApp"
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
          required
        />
        <button className="mt-4 w-full p-3 rounded bg-gold text-black">Entrar e Preencher</button>
      </form>
    </div>
  )
}
