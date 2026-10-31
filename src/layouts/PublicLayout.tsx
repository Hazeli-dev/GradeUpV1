import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import { publicNav } from '@/constants/nav'
import { cn } from '@/lib/utils'

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const link = ({ isActive }: { isActive: boolean }) =>
    cn('rounded-lg px-3 py-2 text-sm font-semibold', isActive ? 'text-primary' : 'text-muted hover:text-text')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Logo />
          <nav className="ml-6 hidden flex-1 items-center gap-1 md:flex">
            {publicNav.map((n) => <NavLink key={n.to} to={n.to} className={link}>{n.label}</NavLink>)}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <ThemeToggle />
            <Link to="/login" className="btn-ghost hidden sm:inline-flex">Masuk</Link>
            <Link to="/register" className="btn-primary hidden sm:inline-flex">Daftar Gratis</Link>
            <button className="btn-ghost h-10 w-10 !p-0 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="space-y-1 border-t border-border px-4 py-3 md:hidden">
            {publicNav.map((n) => <NavLink key={n.to} to={n.to} className={link} onClick={() => setOpen(false)}>{n.label}</NavLink>)}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-ghost flex-1 border border-border">Masuk</Link>
              <Link to="/register" className="btn-primary flex-1">Daftar Gratis</Link>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} GradeUp. Semua hak dilindungi.</p>
          <div className="flex gap-4"><Link to="/about">Tentang</Link><Link to="/faq">FAQ</Link><Link to="/contact">Kontak</Link></div>
        </div>
      </footer>
    </div>
  )
}
