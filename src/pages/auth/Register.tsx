import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard, { ServerError } from '@/components/AuthCard'
import Field from '@/components/Field'
import { useToast } from '@/components/Toast'
import { signUp } from '@/services/auth'
import { isEmail, passwordError } from '@/utils/validators'

export default function Register() {
  const nav = useNavigate()
  const toast = useToast()
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' })
  const [terms, setTerms] = useState(false)
  const [err, setErr] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [server, setServer] = useState('')
  
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (v.name.trim().length < 2) er.name = 'Nama minimal 2 karakter'
    if (!isEmail(v.email)) er.email = 'Masukkan email yang valid'
    const pe = passwordError(v.password); if (pe) er.password = pe
    if (v.confirm !== v.password) er.confirm = 'Konfirmasi kata sandi tidak sama'
    if (!terms) er.terms = 'Setujui syarat dan ketentuan untuk melanjutkan'
    setErr(er)
    setServer('')
    if (Object.keys(er).length) return

    setLoading(true)
    const r = await signUp(v.email.trim(), v.password, v.name.trim())
    setLoading(false)

    if (!r.ok) return setServer(r.message ?? 'Pendaftaran gagal. Coba lagi.')

    // PERBAIKAN: Berikan notifikasi & langsung arahkan ke halaman Login
    toast('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.')
    nav('/login')
  }

  return (
    <AuthCard 
      title="Buat akun GradeUp" 
      subtitle="Gratis, tanpa kartu kredit."
      footer={<>Sudah punya akun? <Link to="/login" className="font-semibold text-primary">Masuk</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <ServerError message={server} />
        <Field label="Nama lengkap" name="name" autoComplete="name" value={v.name} onChange={set('name')} error={err.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={err.email} />
        <Field label="Kata sandi" name="password" type="password" autoComplete="new-password" value={v.password} onChange={set('password')} error={err.password} />
        <Field label="Konfirmasi kata sandi" name="confirm" type="password" autoComplete="new-password" value={v.confirm} onChange={set('confirm')} error={err.confirm} />
        <div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            Saya menyetujui syarat dan ketentuan serta kebijakan privasi GradeUp.
          </label>
          {err.terms && <p className="mt-1 text-xs text-red-500">{err.terms}</p>}
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Memproses…' : 'Daftar Gratis'}</button>
        <button type="button" className="btn-ghost w-full border border-border" onClick={() => toast('Daftar dengan Google belum tersedia.', 'info')}>
          Lanjutkan dengan Google
        </button>
      </form>
    </AuthCard>
  )
}
