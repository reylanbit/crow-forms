import { Router } from "express"
import { buildWhatsAppLink } from "../services/whatsapp.js"

const router = Router()

router.get("/ping", async (_req, res) => {
  res.status(200).json({ status: "healthy" })
})

router.post("/whatsapp-link", (req, res) => {
  const { phone, message } = req.body || {}
  const url = buildWhatsAppLink(phone, message)
  res.status(200).json({ url })
})

export default router
