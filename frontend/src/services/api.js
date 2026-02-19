const API_URL = import.meta.env.VITE_API_URL

export async function getHealth() {
  try {
    const res = await fetch(`${API_URL}/health`)
    if (!res.ok) throw new Error('failed')
    return await res.json()
  } catch {
    return { status: 'unavailable' }
  }
}

export async function addResponse(payload) {
  const res = await fetch(`${API_URL}/api/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('failed')
  return await res.json()
}

export async function getResponses() {
  const res = await fetch(`${API_URL}/api/responses`)
  if (!res.ok) throw new Error('failed')
  return await res.json()
}

export async function addMember(payload) {
  const res = await fetch(`${API_URL}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('failed')
  return await res.json()
}

export async function getMembers() {
  const res = await fetch(`${API_URL}/api/members`)
  if (!res.ok) throw new Error('failed')
  return await res.json()
}
