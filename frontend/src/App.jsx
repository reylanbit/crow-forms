import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Public from './pages/Public'
import Formulario from './pages/Formulario'
import Login from './pages/Login'
import Admin from './pages/Admin'
 

function App() {
  const [isMember, setIsMember] = useState(sessionStorage.getItem('crows_member') === '1')
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('crows_admin') === '1')

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

  return (
    <BrowserRouter>
      <nav className="flex gap-4 p-4 text-gold">
        <Link to="/" className="underline">Início</Link>
        {isMember && <Link to="/formulario" className="underline">Formulário</Link>}
        {!isMember && <Link to="/login" className="underline">Login Membros</Link>}
        {isMember && (
          <Link
            to="/"
            className="underline"
            onClick={() => {
              sessionStorage.removeItem('crows_member')
              sessionStorage.removeItem('member_name')
              sessionStorage.removeItem('member_phone')
              window.dispatchEvent(new Event('crows_session_update'))
            }}
          >
            Sair
          </Link>
        )}
        <Link to="/admin" className="underline">Admin</Link>
        {isAdmin && (
          <Link
            to="/"
            className="underline"
            onClick={() => {
              sessionStorage.removeItem('crows_admin')
              window.dispatchEvent(new Event('crows_session_update'))
            }}
          >
            Sair (Admin)
          </Link>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Public />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
