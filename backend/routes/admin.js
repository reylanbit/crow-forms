import { Router } from "express"
import { buildWhatsAppLink } from "../services/whatsapp.js"
import * as supabaseStore from "../services/supabaseStore.js"
import redis, { ensureRedisConnected } from "../services/redisClient.js"

const router = Router()

router.get("/ping", async (_req, res) => {
  res.status(200).json({ status: "healthy" })
})

router.post("/whatsapp-link", (req, res) => {
  const { phone, message } = req.body || {}
  const url = buildWhatsAppLink(phone, message)
  res.status(200).json({ url })
})

router.get("/supabase", async (_req, res) => {
  try {
    const fn = supabaseStore?.getSupabaseStatus
    const status = fn ? await fn() : { enabled: false, ok: false }
    res.status(200).json(status)
  } catch {
    res.status(500).json({ enabled: false, ok: false })
  }
})

router.get("/redis", async (_req, res) => {
  try {
    await ensureRedisConnected()
    const pong = await redis.ping()
    res.status(200).json({ ok: true, pong })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) })
  }
})

export default router
