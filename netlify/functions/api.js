import pg from "pg"

const TABLE_MEMBERS = process.env.SUPABASE_MEMBERS_TABLE || "members_logins"
const TABLE_RESPONSES = process.env.RESPONSES_TABLE || "responses"
const PG_URL = process.env.POSTGRES_URL || null

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

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }
}

export async function handler(event) {
  const p = getPool()
  const path = (event.path || "").replace("/.netlify/functions/api", "") || "/"
  const method = (event.httpMethod || "GET").toUpperCase()

  try {
    if (path === "/health") {
      return json(200, { status: "healthy" })
    }

    if (path === "/api/admin/ping") {
      return json(200, { status: "healthy" })
    }

    if (path === "/api/admin/supabase") {
      try {
        if (!p) return json(200, { enabled: false, ok: false, table: TABLE_MEMBERS })
        await p.query(`SELECT 1 FROM ${TABLE_MEMBERS} LIMIT 1`)
        return json(200, { enabled: true, ok: true, table: TABLE_MEMBERS })
      } catch (e) {
        return json(200, { enabled: !!pool, ok: false, table: TABLE_MEMBERS, error: String(e?.message || e) })
      }
    }

    if (path === "/api/members" && method === "GET") {
      if (!p) return json(200, [])
      const { rows } = await p.query(`SELECT nome, whatsapp, ts FROM ${TABLE_MEMBERS} ORDER BY ts DESC`)
      return json(200, rows || [])
    }

    if (path === "/api/members" && method === "POST") {
      if (!p) return json(500, { error: "db_unavailable" })
      const payload = JSON.parse(event.body || "{}")
      const ts = new Date().toISOString()
      const nome = payload?.nome || null
      const whatsapp = payload?.telefone || payload?.whatsapp || null
      await p.query(`INSERT INTO ${TABLE_MEMBERS} (nome, whatsapp, ts) VALUES ($1, $2, $3)`, [nome, whatsapp, ts])
      return json(201, { ok: true })
    }

    if (path === "/api/members/export" && method === "GET") {
      if (!p) return { statusCode: 500, body: "db_unavailable" }
      const { rows } = await p.query(`SELECT nome, whatsapp, ts FROM ${TABLE_MEMBERS} ORDER BY ts DESC`)
      const header = "nome,whatsapp,ts\n"
      const body = (rows || []).map(r => `${r.nome},${r.whatsapp},${r.ts}`).join("\n") + "\n"
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=\"members.csv\""
        },
        body: header + body
      }
    }

    if (path === "/api/responses" && method === "GET") {
      if (!p) return json(200, [])
      const { rows } = await p.query(`SELECT nome, nick, quinta, sabado, classe, ressonancia, tempo, telefone, created_at FROM ${TABLE_RESPONSES} ORDER BY created_at DESC`)
      return json(200, rows || [])
    }

    if (path === "/api/responses" && method === "POST") {
      if (!p) return json(500, { error: "db_unavailable" })
      const payload = JSON.parse(event.body || "{}")
      const now = new Date().toISOString()
      const fields = ["nome","nick","quinta","sabado","classe","ressonancia","tempo","telefone"]
      const values = fields.map(k => payload?.[k] ?? null)
      await p.query(
        `INSERT INTO ${TABLE_RESPONSES} (nome, nick, quinta, sabado, classe, ressonancia, tempo, telefone, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [...values, now]
      )
      return json(201, { ok: true })
    }

    return json(404, { error: "not_found", path })
  } catch (e) {
    return json(500, { error: "failed", message: String(e?.message || e) })
  }
}
