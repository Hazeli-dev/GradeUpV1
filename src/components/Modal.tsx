import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props { open: boolean; onClose: () => void; title: string; children: ReactNode }

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="card relative w-full max-w-md p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted hover:text-text" aria-label="Tutup"><X size={18} /></button>
        <h2 className="pr-6 text-lg font-extrabold">{title}</h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  )
}
