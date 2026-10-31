import { useState, type FormEvent } from 'react'
import Field from '@/components/Field'
import Tabs from '@/components/Tabs'
import Toggle from '@/components/Toggle'
import { useToast } from '@/components/Toast'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { isEmail } from '@/utils/validators'

const tabs = ['Umum', 'Tampilan', 'Notifikasi']

export default function Settings() {
  const toast = useToast(); const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState(tabs[0])
  const [g, setG] = useState({ name: 'GradeUp', email: 'dukungan@gradeup.example', signup: true })
  const [err, setErr] = useState<Record<string, string>>({})
  const [n, setN] = useState({ trx: true, signup: true, weekly: false })

  function saveGeneral(e: FormEvent) {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (g.name.trim().length < 2) er.name = 'Nama platform minimal 2 karakter'
    if (!isEmail(g.email)) er.email = 'Masukkan email yang valid'
    setErr(er)
    if (Object.keys(er).length === 0) toast('Pengaturan disimpan (demo, belum tersimpan di server)')
  }
  const rows: [keyof typeof n, string][] = [['trx', 'Notifikasi transaksi baru'], ['signup', 'Notifikasi pendaftaran pengguna'], ['weekly', 'Ringkasan laporan mingguan']]

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Pengaturan Sistem</h1>
      <Tabs tabs={tabs} value={tab} onChange={(t) => { setTab(t); setErr({}) }} />
      <div className="card p-6">
        {tab === 'Umum' && (
          <form onSubmit={saveGeneral} noValidate className="space-y-4">
            <Field label="Nama platform" name="name" value={g.name} onChange={(e) => setG({ ...g, name: e.target.value })} error={err.name} />
            <Field label="Email dukungan" name="email" type="email" value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} error={err.email} />
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">Izinkan pendaftaran baru</p><p className="text-xs text-muted">Nonaktifkan untuk menutup pendaftaran sementara</p></div>
              <Toggle label="Izinkan pendaftaran baru" checked={g.signup} onChange={(v) => setG({ ...g, signup: v })} /></div>
            <button className="btn-primary">Simpan pengaturan</button>
          </form>)}
        {tab === 'Tampilan' && (
          <div className="grid grid-cols-2 gap-3">{(['light', 'dark'] as const).map((t) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)} className={cn('rounded-2xl border p-4 text-left text-sm font-semibold', theme === t ? 'border-primary ring-2 ring-primary/30' : 'border-border')}>{t === 'light' ? 'Terang' : 'Gelap'}</button>))}</div>)}
        {tab === 'Notifikasi' && (
          <div className="space-y-4">{rows.map(([k, t]) => (
            <div key={k} className="flex items-center justify-between gap-4"><p className="text-sm font-semibold">{t}</p>
              <Toggle label={t} checked={n[k]} onChange={(v) => { setN({ ...n, [k]: v }); toast('Preferensi notifikasi diperbarui', 'info') }} /></div>))}</div>)}
      </div>
    </div>
  )
}
