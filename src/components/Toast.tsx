import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Kind = 'success' | 'error' | 'info'
type Push = (message: string, kind?: Kind) => void
const Ctx = createContext<Push>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string; kind: Kind }[]>([])
  const push = useCallback<Push>((message, kind = 'success') => {
    const id = Date.now() + Math.random()
    setItems((l) => [...l, { id, message, kind }])
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3800)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={cn('card border-l-4 px-4 py-3 text-sm font-medium',
            t.kind === 'success' && 'border-l-secondary', t.kind === 'error' && 'border-l-red-500', t.kind === 'info' && 'border-l-muted')}>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
