import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, service: "the-crows-backend" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
