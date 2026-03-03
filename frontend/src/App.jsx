import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Public from './pages/Public'
import Formulario from './pages/Formulario'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { choice } from './utils/random'
import InstallBanner from './components/InstallBanner'
 

function App() {
  const [isMember, setIsMember] = useState(sessionStorage.getItem('crows_member') === '1')
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('crows_admin') === '1')
  const accent = useMemo(() => choice(['text-gold', 'text-blood']), [])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function sync() {
      setIsMember(sessionStorage.getItem('crows_member') === '1')
      setIsAdmin(sessionStorage.getItem('crows_admin') === '1')
    }
    window.addEventListener('storage', sync)
    window.addEventListener('crows_session_update', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('crows_session_update', sync)
    }
  }, [])

  function IconSword(props) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M13.5 2l8.5 8.5-2.1 2.1-2.4-2.4-3.2 3.2 2.4 2.4-2.1 2.1L4 8.5 6.1 6.4l2.4 2.4 3.2-3.2-2.4-2.4L13.5 2z"></path>
      </svg>
    )
  }

  function IconRaven(props) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M3 12c0-4.4 3.6-8 8-8 3.1 0 5.8 1.7 7.1 4.3l2.4.7-1.6 1.5 1.6 1.5-2.4.7C16.8 16.3 14.1 18 11 18H7l-2 4H3l2-6H3c0-1.3.3-2.5.9-3.6z"></path>
      </svg>
    )
  }

  function IconShield(props) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M12 2l7 3v6c0 5.2-3.3 9-7 11-3.7-2-7-5.8-7-11V5l7-3z"></path>
      </svg>
    )
  }

  function IconHelm(props) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M12 2c4.4 0 8 3.6 8 8v7l-4 3-4-2-4 2-4-3v-7c0-4.4 3.6-8 8-8zm-5 8h3v2H7v-2zm7 0h3v2h-3v-2z"></path>
      </svg>
    )
  }

  function IconScroll(props) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M6 3a3 3 0 000 6h9a2 2 0 010 4H8a3 3 0 000 6h10v-2h2v-6a4 4 0 00-4-4H6a1 1 0 110-2h12V3H6z"></path>
      </svg>
    )
  }

  return (
    <BrowserRouter>
      <nav className={`p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${accent}`}>
            <IconRaven />
            <span className="font-gothic text-xl">The Crows</span>
          </div>
          <button
            className="md:hidden p-2 rounded border border-neutral-700 hover:bg-neutral-800"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"></path>
            </svg>
          </button>
          <div className="hidden md:flex gap-3">
            <Link to="/" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
              <IconShield /> Início
            </Link>
            {isMember && (
              <Link to="/formulario" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
                <IconHelm /> Formulário
              </Link>
            )}
            {!isMember && (
              <Link to="/login" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
                <IconHelm /> Login Membros
              </Link>
            )}
            <Link to="/admin" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
              <IconScroll /> Admin
            </Link>
            {isAdmin && (
              <Link
                to="/"
                className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold"
                onClick={() => {
                  sessionStorage.removeItem('crows_admin')
                  window.dispatchEvent(new Event('crows_session_update'))
                }}
              >
                <IconShield /> Sair (Admin)
              </Link>
            )}
          </div>
        </div>
        {menuOpen && (
          <div className="mt-3 flex flex-col gap-2 md:hidden">
            <Link onClick={() => setMenuOpen(false)} to="/" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
              <IconShield /> Início
            </Link>
            {isMember && (
              <Link onClick={() => setMenuOpen(false)} to="/formulario" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
                <IconHelm /> Formulário
              </Link>
            )}
            {!isMember && (
              <Link onClick={() => setMenuOpen(false)} to="/login" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
                <IconHelm /> Login Membros
              </Link>
            )}
            <Link onClick={() => setMenuOpen(false)} to="/admin" className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 text-gold">
              <IconScroll /> Admin
            </Link>
            {isAdmin && (
              <button
                onClick={() => {
                  sessionStorage.removeItem('crows_admin')
                  window.dispatchEvent(new Event('crows_session_update'))
                  setMenuOpen(false)
                }}
                className="text-left px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 flex items-center gap-2 w-full text-gold"
              >
                <IconShield /> Sair (Admin)
              </button>
            )}
          </div>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Public />} />
      </Routes>
      <InstallBanner />
    </BrowserRouter>
  )
}

export default App
