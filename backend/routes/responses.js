import { Router } from "express"
import { addResponse, getResponses } from "../services/googleSheets.js"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    const data = await getResponses()
    res.status(200).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

router.post("/", async (req, res) => {
  try {
    const payload = req.body || {}
    const data = await addResponse(payload)
    res.status(201).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

export default router
