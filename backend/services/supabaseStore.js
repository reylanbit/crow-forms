import pg from "pg"

const TABLE = process.env.SUPABASE_MEMBERS_TABLE || "members_logins"
const PG_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  null

let pool = null
function getPool() {
  if (!pool && PG_URL) {
    pool = new pg.Pool({
      connectionString: PG_URL,
      ssl: { rejectUnauthorized: false }
    })
  }
  return pool
}

export async function getSupabaseStatus() {
  try {
    const p = getPool()
    if (!p) return { enabled: false, ok: false, table: TABLE }
    const q = `SELECT 1 FROM ${TABLE} LIMIT 1`
    await p.query(q)
    return { enabled: true, ok: true, table: TABLE }
  } catch (e) {
    return { enabled: !!pool, ok: false, table: TABLE, error: String(e?.message || e) }
  }
}

export async function addMemberSupabase(payload) {
  const p = getPool()
  if (!p) return null
  const ts = new Date().toISOString()
  const nome = payload?.nome || null
  const whatsapp = payload?.telefone || payload?.whatsapp || null
  const text = `INSERT INTO ${TABLE} (nome, whatsapp, ts) VALUES ($1, $2, $3)`
  const values = [nome, whatsapp, ts]
  await p.query(text, values)
  return { ok: true }
}

export async function getMembersSupabase() {
  const p = getPool()
  if (!p) return []
  const text = `SELECT nome, whatsapp, ts FROM ${TABLE} ORDER BY ts DESC`
  const { rows } = await p.query(text)
  return rows || []
}
