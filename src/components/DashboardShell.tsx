import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

interface Props { items: NavItem[]; areaLabel: string; homePath: string; userName: string }

export default function DashboardShell({ items, areaLabel, homePath, userName }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const nav = useNavigate()
  const current = items.find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to)))

  const handleLogout = () => {
    // Menghapus sesi atau data login lokal lalu kembali ke halaman utama
    localStorage.removeItem("gradeup_user");
    nav("/");
  }

  return (
    <div className="flex min-h-screen">
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0',
          collapsed && 'md:w-[76px]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Logo to={homePath} compact={collapsed} />
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Tutup menu"><X size={20} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {items.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end} onClick={() => setOpen(false)} title={label}
              className={({ isActive }) =>
                cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive ? 'gradient-brand text-white shadow-card' : 'text-muted hover:bg-soft/60 hover:text-text')
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Tombol Keluar (Log Out) */}
        <button
          onClick={handleLogout}
          title="Keluar"
          className="mx-3 mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">Keluar</span>}
        </button>

        {/* Tombol Ciutkan Menu */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mx-3 mb-3 hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:bg-soft/60 md:flex"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /> Ciutkan menu</>}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur">
          <button className="btn-ghost h-10 w-10 !p-0 md:hidden" onClick={() => setOpen(true)} aria-label="Buka menu"><Menu size={20} /></button>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">{areaLabel}</p>
            <p className="truncate text-sm font-bold">{current?.label ?? 'Halaman'}</p>
          </div>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <span className="gradient-brand grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white">{userName.charAt(0)}</span>
            <span className="hidden text-sm font-semibold sm:block">{userName}</span>
          </div>
        </header>
        <main className="flex-1"><Outlet /></main>
      </div>
    </div>
  )
}
