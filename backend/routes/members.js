import { Router } from "express"
import { addMemberFile, getMembersFile } from "../services/fileStore.js"
import { addMemberSupabase, getMembersSupabase } from "../services/supabaseStore.js"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    let data = []
    if (!Array.isArray(data) || data.length === 0) {
      try {
        data = await getMembersSupabase()
      } catch {
        // ignore
      }
    }
    if (!Array.isArray(data) || data.length === 0) {
      data = await getMembersFile()
    }
    res.status(200).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

router.post("/", async (req, res) => {
  try {
    const payload = req.body || {}
    let data = { ok: true }
    try {
      await addMemberSupabase(payload)
    } catch {
      // ignore
    }
    await addMemberFile(payload)
    res.status(201).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

router.get("/export", async (_req, res) => {
  try {
    const rows = await getMembersFile()
    const header = "nome,whatsapp,ts\n"
    const body = rows.map(r => `${r.nome},${r.whatsapp},${r.ts}`).join("\n") + "\n"
    const csv = header + body
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=\"members.csv\"")
    res.status(200).send(csv)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

export default router
