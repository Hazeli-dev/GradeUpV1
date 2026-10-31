import { useLocation } from 'react-router-dom'
import { Construction } from 'lucide-react'

export default function PagePlaceholder({ title, area }: { title: string; area: string }) {
  const { pathname } = useLocation()
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="card p-8 text-center">
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-soft text-primary">
          <Construction size={22} />
        </span>
        <p className="text-sm font-medium text-muted">{area}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Rute dan layout halaman ini sudah aktif. Isinya akan dibangun pada fase berikutnya tanpa mengubah struktur proyek.
        </p>
        <code className="mt-5 inline-block rounded-lg bg-bg px-3 py-1.5 text-xs text-muted">{pathname}</code>
      </div>
    </section>
  )
}
