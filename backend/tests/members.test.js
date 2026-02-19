import request from "supertest"
import { app } from "../server.js"
import { vi, test, expect } from "vitest"

vi.mock("../services/googleSheets.js", () => {
  return {
    addMember: vi.fn(async () => ({ ok: true })),
    getMembers: vi.fn(async () => [{ nome: "TC Arthur", telefone: "5585985322374" }])
  }
})

test("GET /api/members", async () => {
  const res = await request(app).get("/api/members")
  expect(res.status).toBe(200)
  expect(res.body.length).toBeGreaterThan(0)
})

test("POST /api/members", async () => {
  const res = await request(app).post("/api/members").send({ nome: "Lilith", telefone: "5599999999999" })
  expect(res.status).toBe(201)
  expect(res.body).toEqual({ ok: true })
  // ensure mock called
  // eslint-disable-next-line no-undef
  const mod = await import("../services/googleSheets.js")
  expect(mod.addMember).toHaveBeenCalled()
})
