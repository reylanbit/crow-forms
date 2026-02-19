import { Router } from "express"
import { ping } from "../services/googleSheets.js"
import { buildWhatsAppLink } from "../services/whatsapp.js"

const router = Router()

router.get("/ping", async (_req, res) => {
  try {
    const data = await ping()
    res.status(200).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

router.post("/whatsapp-link", (req, res) => {
  const { phone, message } = req.body || {}
  const url = buildWhatsAppLink(phone, message)
  res.status(200).json({ url })
})

export default router
