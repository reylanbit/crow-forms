import { Router } from "express"
import { addMember, getMembers } from "../services/googleSheets.js"
import { addMemberFile, getMembersFile } from "../services/fileStore.js"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    let data = []
    try {
      data = await getMembers()
    } catch {
      // ignore
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
    let data = null
    try {
      data = await addMember(payload)
    } catch {
      // ignore
    }
    await addMemberFile(payload)
    res.status(201).json(data)
  } catch {
    res.status(500).json({ error: "failed" })
  }
})

export default router
