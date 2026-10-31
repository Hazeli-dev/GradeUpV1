import { useState, type FormEvent } from 'react'
import { student } from '@/data/student'
import Field from '@/components/Field'
import Tabs from '@/components/Tabs'
import Toggle from '@/components/Toggle'
import { useToast } from '@/components/Toast'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { isEmail, passwordError } from '@/utils/validators'

const tabs = ['Profil', 'Akun', 'Notifikasi', 'Preferensi', 'Tema']

export default function Settings() {
  const toast = useToast(); const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState(tabs[0])
  const [profile, setProfile] = useState({ name: student.name, level: student.level })
  const [acc, setAcc] = useState({ email: student.email, password: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [notif, setNotif] = useState({ reminder: true, results: true, promo: false })
  const [goal, setGoal] = useState('45')

  function saveProfile(e: FormEvent) {
    e.preventDefault()
    if (profile.name.trim().length < 2) return setErr({ name: 'Nama minimal 2 karakter' })
    setErr({}); toast('Profil disimpan (demo, belum tersimpan di server)')
  }
  function saveAccount(e: FormEvent) {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!isEmail(acc.email)) er.email = 'Masukkan email yang valid'
    if (acc.password) { const pe = passwordError(acc.password); if (pe) er.password = pe }
    setErr(er)
    if (Object.keys(er).length === 0) { setAcc({ ...acc, password: '' }); toast('Perubahan akun disimpan (demo)') }
  }

  const rows: [keyof typeof notif, string, string][] = [
    ['reminder', 'Pengingat belajar harian', 'Notifikasi agar streak tidak terputus'],
    ['results', 'Hasil ujian', 'Beri tahu saat nilai dan pembahasan siap'],
    ['promo', 'Info promo', 'Penawaran paket Premium'],
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Pengaturan</h1>
      <Tabs tabs={tabs} value={tab} onChange={(t) => { setTab(t); setErr({}) }} />
      <div className="card p-6">
        {tab === 'Profil' && (
          <form onSubmit={saveProfile} noValidate className="space-y-4">
            <Field label="Nama lengkap" name="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} error={err.name} />
            <div><label htmlFor="level" className="mb-1.5 block text-sm font-semibold">Jenjang</label>
              <select id="level" className="input" value={profile.level} onChange={(e) => setProfile({ ...profile, level: e.target.value })}>{['SD', 'SMP', 'SMA', 'Umum'].map((l) => <option key={l}>{l}</option>)}</select></div>
            <button className="btn-primary">Simpan profil</button>
          </form>)}
        {tab === 'Akun' && (
          <form onSubmit={saveAccount} noValidate className="space-y-4">
            <Field label="Email" name="email" type="email" value={acc.email} onChange={(e) => setAcc({ ...acc, email: e.target.value })} error={err.email} />
            <Field label="Kata sandi baru (opsional)" name="password" type="password" autoComplete="new-password" value={acc.password} onChange={(e) => setAcc({ ...acc, password: e.target.value })} error={err.password} />
            <button className="btn-primary">Simpan akun</button>
          </form>)}
        {tab === 'Notifikasi' && (
          <div className="space-y-4">{rows.map(([k, t, d]) => (
            <div key={k} className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted">{d}</p></div>
              <Toggle label={t} checked={notif[k]} onChange={(v) => { setNotif({ ...notif, [k]: v }); toast('Preferensi notifikasi diperbarui', 'info') }} /></div>))}</div>)}
        {tab === 'Preferensi' && (
          <div className="space-y-4">
            <div><label htmlFor="goal" className="mb-1.5 block text-sm font-semibold">Target belajar harian</label>
              <select id="goal" className="input" value={goal} onChange={(e) => { setGoal(e.target.value); toast('Target belajar diperbarui', 'info') }}>{['15', '30', '45', '60', '90'].map((m) => <option key={m} value={m}>{m} menit</option>)}</select></div>
            <p className="text-xs text-muted">Bahasa antarmuka: Indonesia.</p>
          </div>)}
        {tab === 'Tema' && (
          <div className="grid grid-cols-2 gap-3">{(['light', 'dark'] as const).map((t) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}
              className={cn('rounded-2xl border p-4 text-left text-sm font-semibold', theme === t ? 'border-primary ring-2 ring-primary/30' : 'border-border')}>{t === 'light' ? 'Terang' : 'Gelap'}</button>))}</div>)}
      </div>
    </div>
  )
}
