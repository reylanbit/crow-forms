import request from "supertest"
import { app } from "../server.js"
import { test, expect } from "vitest"

test("GET /health returns healthy", async () => {
  const res = await request(app).get("/health")
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ status: "healthy" })
})
