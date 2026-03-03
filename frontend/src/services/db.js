const DB_NAME = "crows-db"
const DB_VERSION = 1
const STORES = ["members", "responses"]

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      for (const s of STORES) {
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s, { keyPath: "id", autoIncrement: true })
        }
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function withStore(name, mode, fn) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(name, mode)
    const store = tx.objectStore(name)
    const res = fn(store)
    tx.oncomplete = () => resolve(res)
    tx.onerror = () => reject(tx.error)
  })
}

export async function salvarDado(colecao, dados) {
  return withStore(colecao, "readwrite", (store) => store.add(dados))
}

export async function buscarDados(colecao) {
  return withStore(colecao, "readonly", (store) => {
    return new Promise((resolve, reject) => {
      const r = store.getAll()
      r.onsuccess = () => resolve(r.result || [])
      r.onerror = () => reject(r.error)
    })
  })
}

export async function atualizarDado(colecao, id, novosDados) {
  const rows = await buscarDados(colecao)
  const idx = rows.findIndex((r) => r.id === id)
  if (idx === -1) return false
  const updated = { ...rows[idx], ...novosDados, id }
  return withStore(colecao, "readwrite", (store) => store.put(updated))
}

export async function deletarDado(colecao, id) {
  return withStore(colecao, "readwrite", (store) => store.delete(id))
}

export async function limparColecao(colecao) {
  return withStore(colecao, "readwrite", (store) => store.clear())
}

export async function inserirMuitos(colecao, itens) {
  return withStore(colecao, "readwrite", (store) => {
    for (const it of itens) store.add(it)
  })
}
