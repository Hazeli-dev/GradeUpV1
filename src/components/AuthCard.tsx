import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      {!isSupabaseConfigured && (
        <p className="mt-4 flex gap-2 rounded-xl bg-soft/60 p-3 text-xs text-muted">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" />
          Mode demo: autentikasi hanya simulasi dan tidak mengamankan akun atau data apa pun.
        </p>
      )}
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
    </div>
  )
}

export const ServerError = ({ message }: { message: string }) =>
  message ? <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">{message}</p> : null
