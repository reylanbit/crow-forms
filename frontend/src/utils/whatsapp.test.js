import { test, expect } from "vitest"
import { buildWhatsAppLink } from "./whatsapp"

test("buildWhatsAppLink normaliza telefone e codifica mensagem", () => {
  const url = buildWhatsAppLink("(55) 85 98532-2374", "Olá Corvo!")
  expect(url).toBe("https://wa.me/5585985322374?text=Ol%C3%A1%20Corvo!")
})
