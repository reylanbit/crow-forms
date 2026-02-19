import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Public from './pages/Public'
import Formulario from './pages/Formulario'
import Login from './pages/Login'
import Admin from './pages/Admin'
 

function App() {
  return (
    <BrowserRouter>
      <nav className="flex gap-4 p-4 text-gold">
        <Link to="/" className="underline">Início</Link>
        <Link to="/formulario" className="underline">Formulário</Link>
        <Link to="/login" className="underline">Login Membros</Link>
        <Link to="/admin" className="underline">Admin</Link>
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
