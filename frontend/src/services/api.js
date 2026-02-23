const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : ''

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
  try {
    const res = await fetch(`${API_URL}/api/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('failed')
    return await res.json()
  } catch {
    return { ok: false }
  }
}

export async function getResponses() {
  try {
    const res = await fetch(`${API_URL}/api/responses`)
    if (!res.ok) throw new Error('failed')
    return await res.json()
  } catch {
    return []
  }
}

export async function addMember(payload) {
  try {
    const res = await fetch(`${API_URL}/api/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('failed')
    return await res.json()
  } catch {
    return { ok: false }
  }
}

export async function getMembers() {
  try {
    const res = await fetch(`${API_URL}/api/members`)
    if (!res.ok) throw new Error('failed')
    return await res.json()
  } catch {
    return []
  }
}

export async function getSupabaseStatus() {
  try {
    const res = await fetch(`${API_URL}/api/admin/supabase`)
    if (!res.ok) throw new Error('failed')
    return await res.json()
  } catch {
    return { enabled: false, ok: false }
  }
}
