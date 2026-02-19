import request from "supertest"
import { app } from "../server.js"
import { test, expect } from "vitest"

test("GET /api/members", async () => {
  const res = await request(app).get("/api/members")
  expect(res.status).toBe(200)
  expect(Array.isArray(res.body)).toBe(true)
})

test("POST /api/members", async () => {
  const res = await request(app).post("/api/members").send({ nome: "Lilith", telefone: "5599999999999" })
  expect(res.status).toBe(201)
  expect(res.body).toEqual({ ok: true })
})
