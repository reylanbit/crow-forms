import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Public from './pages/Public'
import Formulario from './pages/Formulario'
import Login from './pages/Login'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 12, padding: 12 }}>
        <Link to="/">Public</Link>
        <Link to="/formulario">Formulário</Link>
        <Link to="/login">Login</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
