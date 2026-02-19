import request from "supertest"
import { app } from "../server.js"
import { vi, test, expect } from "vitest"

vi.mock("../services/googleSheets.js", () => {
  return {
    ping: vi.fn(async () => ({ status: "healthy" }))
  }
})

test("GET /api/admin/ping", async () => {
  const res = await request(app).get("/api/admin/ping")
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ status: "healthy" })
})
