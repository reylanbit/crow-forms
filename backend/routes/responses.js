import { Router } from "express"
import { addResponse, getResponses } from "../services/googleSheets.js"
import { addResponseFile, getResponsesFile } from "../services/fileStore.js"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    let data = []
    try {
      data = await getResponses()
    } catch {
      // ignore
    }
    if (!Array.isArray(data) || data.length === 0) {
      data = await getResponsesFile()
    }
    res.status(200).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

router.post("/", async (req, res) => {
  try {
    const payload = req.body || {}
    let data = null
    try {
      data = await addResponse(payload)
    } catch {
      // ignore
    }
    await addResponseFile(payload)
    res.status(201).json(data || { ok: true })
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

export default router
