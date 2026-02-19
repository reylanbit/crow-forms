import { useEffect, useState } from 'react'
import { getHealth } from '../services/api'

export default function Public() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    getHealth().then(setHealth)
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Public</h1>
      <p>Bem-vindo ao Crow Forms.</p>
      <div style={{ marginTop: 12 }}>
        <strong>Backend:</strong> {health?.status || '...'}
      </div>
    </div>
  )
}
