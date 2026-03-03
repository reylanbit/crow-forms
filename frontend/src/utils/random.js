export function choice(list) {
  const arr = Array.isArray(list) ? list : []
  if (arr.length === 0) return null
  const i = Math.floor(Math.random() * arr.length)
  return arr[i]
}

export function chance(p) {
  const prob = Number(p) || 0
  return Math.random() < prob
}
