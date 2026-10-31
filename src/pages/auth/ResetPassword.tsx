import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard, { ServerError } from '@/components/AuthCard'
import Field from '@/components/Field'
import { useToast } from '@/components/Toast'
import { updatePassword } from '@/services/auth'
import { passwordError } from '@/utils/validators'

export default function ResetPassword() {
  const nav = useNavigate(); const toast = useToast()
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState<Record<string, string>>({}); const [loading, setLoading] = useState(false); const [server, setServer] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault(); setServer('')
    const er: Record<string, string> = {}
    const pe = passwordError(password); if (pe) er.password = pe
    if (confirm !== password) er.confirm = 'Konfirmasi kata sandi tidak sama'
    setErr(er)
    if (Object.keys(er).length) return
    setLoading(true)
    const r = await updatePassword(password)
    setLoading(false)
    if (!r.ok) return setServer(r.message ?? 'Gagal mengubah kata sandi. Minta tautan baru.')
    toast('Kata sandi diperbarui. Silakan masuk.')
    nav('/login')
  }

  return (
    <AuthCard title="Atur ulang kata sandi" subtitle="Buat kata sandi baru untuk akunmu.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <ServerError message={server} />
        <Field label="Kata sandi baru" name="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={err.password} />
        <Field label="Konfirmasi kata sandi" name="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={err.confirm} />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Menyimpan…' : 'Simpan kata sandi'}</button>
      </form>
    </AuthCard>
  )
}
