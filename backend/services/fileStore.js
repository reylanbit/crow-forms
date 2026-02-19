import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.resolve(__dirname, "../data")
const membersFile = path.join(dataDir, "members.csv")

async function ensure() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    await fs.access(membersFile).catch(async () => {
      await fs.writeFile(membersFile, "nome,whatsapp,ts\n", "utf8")
    })
  } catch {}
}

export async function addMemberFile(payload) {
  await ensure()
  const nome = (payload?.nome || "").toString().replace(/\r?\n/g, " ").trim()
  const whatsapp = (payload?.telefone || payload?.whatsapp || "").toString().replace(/\r?\n/g, " ").trim()
  const ts = new Date().toISOString()
  const line = `${nome},${whatsapp},${ts}\n`
  await fs.appendFile(membersFile, line, "utf8")
  return { ok: true }
}

export async function getMembersFile() {
  await ensure()
  const text = await fs.readFile(membersFile, "utf8")
  const lines = text.trim().split(/\r?\n/).slice(1)
  return lines.map((l) => {
    const [nome, whatsapp, ts] = l.split(",")
    return { nome, whatsapp, ts }
  })
}
