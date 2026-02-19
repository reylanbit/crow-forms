import { Router } from "express"
import { addResponseFile, getResponsesFile } from "../services/fileStore.js"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    const data = await getResponsesFile()
    res.status(200).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

router.post("/", async (req, res) => {
  try {
    const payload = req.body || {}
    const data = { ok: true }
    await addResponseFile(payload)
    res.status(201).json(data || { ok: true })
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

export default router
