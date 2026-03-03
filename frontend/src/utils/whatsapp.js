export function buildWhatsAppLink(phone, message) {
  const num = String(phone || '').replace(/\D/g, '')
  const msg = encodeURIComponent(String(message || ''))
  return `https://wa.me/${num}?text=${msg}`
}
