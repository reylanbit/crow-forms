import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const TABLE = process.env.SUPABASE_MEMBERS_TABLE || "members_logins"

let client = null
function getClient() {
  if (!client && SUPABASE_URL && SUPABASE_KEY) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY)
  }
  return client
}

export async function addMemberSupabase(payload) {
  const c = getClient()
  if (!c) return null
  const ts = new Date().toISOString()
  const data = {
    nome: payload?.nome || null,
    whatsapp: payload?.telefone || payload?.whatsapp || null,
    ts
  }
  const { error } = await c.from(TABLE).insert(data)
  if (error) throw error
  return { ok: true }
}

export async function getMembersSupabase() {
  const c = getClient()
  if (!c) return []
  const { data, error } = await c.from(TABLE).select("nome,whatsapp,ts").order("ts", { ascending: false })
  if (error) throw error
  return data || []
}
