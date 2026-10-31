import { Link, Outlet } from 'react-router-dom'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside className="gradient-brand hidden flex-col justify-between p-10 text-white md:flex">
        <Logo light />
        <div>
          <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">Latihan rutin, nilai naik, kelas terlewati.</h2>
          <p className="mt-3 max-w-sm text-white/80">Materi, latihan soal, dan ujian online dalam satu tempat.</p>
        </div>
        <p className="text-sm text-white/70">© {new Date().getFullYear()} GradeUp</p>
      </aside>
      <main className="flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="text-sm font-semibold text-muted hover:text-text">← Kembali ke beranda</Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center p-4"><div className="w-full max-w-md"><Outlet /></div></div>
      </main>
    </div>
  )
}
