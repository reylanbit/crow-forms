export async function pickTCContacts() {
  const supported = !!(navigator && navigator.contacts && navigator.contacts.select)
  if (!supported) return []
  const props = ["name", "tel"]
  const opts = { multiple: true }
  const contacts = await navigator.contacts.select(props, opts)
  const out = []
  for (const c of contacts) {
    const name = Array.isArray(c.name) ? c.name[0] || "" : c.name || ""
    const tels = Array.isArray(c.tel) ? c.tel : []
    const match = /TC|[A-Z]{2}/.test(name)
    if (match) {
      for (const t of tels) {
        if (t) out.push({ nome: name, telefone: String(t).replace(/\D/g, ""), permissao: "granted" })
      }
    }
  }
  return out
}
