import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard, { ServerError } from '@/components/AuthCard'
import Field from '@/components/Field'
import { useToast } from '@/components/Toast'
import { signIn } from '@/services/auth'
import { isEmail } from '@/utils/validators'

export default function Login() {
  const nav = useNavigate(); const toast = useToast()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [err, setErr] = useState<Record<string, string>>({}); const [loading, setLoading] = useState(false); const [server, setServer] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!isEmail(email)) er.email = 'Masukkan email yang valid'
    if (!password) er.password = 'Kata sandi wajib diisi'
    setErr(er); setServer('')
    if (Object.keys(er).length) return
    setLoading(true)
    const r = await signIn(email.trim(), password)
    setLoading(false)
    if (!r.ok) return setServer(r.message ?? 'Gagal masuk. Periksa email dan kata sandi.')
    toast(r.demo ? 'Masuk (mode demo)' : 'Berhasil masuk')
    nav('/dashboard')
  }

  return (
    <AuthCard title="Masuk ke GradeUp" subtitle="Lanjutkan belajar dari terakhir kamu berhenti."
      footer={<>Belum punya akun? <Link to="/register" className="font-semibold text-primary">Daftar Gratis</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <ServerError message={server} />
        <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err.email} />
        <Field label="Kata sandi" name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={err.password} />
        <div className="text-right text-sm"><Link to="/forgot-password" className="font-semibold text-primary">Lupa kata sandi?</Link></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Memproses…' : 'Masuk'}</button>
        <button type="button" className="btn-ghost w-full border border-border" onClick={() => toast('Login Google belum tersedia.', 'info')}>Lanjutkan dengan Google</button>
      </form>
    </AuthCard>
  )
}
