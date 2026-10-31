import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthCard, { ServerError } from '@/components/AuthCard'
import Field from '@/components/Field'
import { requestPasswordReset } from '@/services/auth'
import { isEmail } from '@/utils/validators'

export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false); const [server, setServer] = useState(''); const [sent, setSent] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setServer('')
    if (!isEmail(email)) return setErr('Masukkan email yang valid')
    setErr(''); setLoading(true)
    const r = await requestPasswordReset(email.trim())
    setLoading(false)
    if (!r.ok) return setServer(r.message ?? 'Gagal mengirim tautan. Coba lagi.')
    setSent(true)
  }

  return (
    <AuthCard title="Lupa kata sandi" subtitle="Masukkan email akunmu untuk menerima tautan atur ulang."
      footer={<Link to="/login" className="font-semibold text-primary">Kembali ke halaman masuk</Link>}>
      {sent ? (
        <p role="status" className="rounded-xl bg-soft/60 p-4 text-sm">Jika email terdaftar, tautan atur ulang kata sandi akan dikirim ke <b>{email}</b>.</p>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <ServerError message={server} />
          <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Mengirim…' : 'Kirim tautan'}</button>
        </form>
      )}
    </AuthCard>
  )
}
