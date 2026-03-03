import { useEffect, useState } from 'react'

export default function InstallBanner() {
  const [deferred, setDeferred] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onPrompt(e) {
      e.preventDefault()
      setDeferred(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg p-4 flex items-center gap-3 z-50">
      <div className="text-sm">
        Instale o app para acesso rápido e offline.
      </div>
      <button
        className="px-3 py-2 rounded bg-gold text-black"
        onClick={async () => {
          if (!deferred) return
          setVisible(false)
          const p = deferred
          setDeferred(null)
          await p.prompt()
        }}
      >
        Instalar
      </button>
      <button
        className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
        onClick={() => setVisible(false)}
      >
        Agora não
      </button>
    </div>
  )
}
