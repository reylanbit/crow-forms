import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import membersRouter from "./routes/members.js"
import responsesRouter from "./routes/responses.js"
import adminRouter from "./routes/admin.js"

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy" })
})

app.use("/api/members", membersRouter)
app.use("/api/responses", responsesRouter)
app.use("/api/admin", adminRouter)

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
