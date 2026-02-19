import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.resolve(__dirname, "../data")
const membersFile = path.join(dataDir, "members.csv")
const responsesFile = path.join(dataDir, "responses.csv")

async function ensure() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    await fs.access(membersFile).catch(async () => {
      const banner = [
        "# ========================== The Crows — Diablo IV ==========================",
        "# CSV de Membros — formato: nome, whatsapp, ts",
        "nome,whatsapp,ts",
        ""
      ].join("\n")
      await fs.writeFile(membersFile, banner, "utf8")
    })
    await fs.access(responsesFile).catch(async () => {
      const banner = [
        "# ========================== The Crows — Diablo IV ==========================",
        "# CSV de Respostas — formato: nome, nick, quinta, sabado, classe, ressonancia, ts",
        "nome,nick,quinta,sabado,classe,ressonancia,ts",
        ""
      ].join("\n")
      await fs.writeFile(responsesFile, banner, "utf8")
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
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.toLowerCase() !== "nome,whatsapp,ts")
  return rows.map((l) => {
    const [nome, whatsapp, ts] = l.split(",")
    return { nome, whatsapp, ts }
  })
}

export async function addResponseFile(payload) {
  await ensure()
  const nome = (payload?.nome || "").toString().replace(/\r?\n/g, " ").trim()
  const nick = (payload?.nick || "").toString().replace(/\r?\n/g, " ").trim()
  const quinta = (payload?.quinta || "").toString().trim()
  const sabado = (payload?.sabado || "").toString().trim()
  const classe = (payload?.classe || "").toString().replace(/\r?\n/g, " ").trim()
  const ressonancia = (payload?.ressonancia || "").toString().trim()
  const ts = new Date().toISOString()
  const line = `${nome},${nick},${quinta},${sabado},${classe},${ressonancia},${ts}\n`
  await fs.appendFile(responsesFile, line, "utf8")
  return { ok: true }
}

export async function getResponsesFile() {
  await ensure()
  const text = await fs.readFile(responsesFile, "utf8")
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.toLowerCase() !== "nome,nick,quinta,sabado,classe,ressonancia,ts")
  return rows.map((l) => {
    const [nome, nick, quinta, sabado, classe, ressonancia, ts] = l.split(",")
    return { nome, nick, quinta, sabado, classe, ressonancia, ts }
  })
}
