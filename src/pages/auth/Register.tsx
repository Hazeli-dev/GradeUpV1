import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard, { ServerError } from '@/components/AuthCard'
import Field from '@/components/Field'
import { useToast } from '@/components/Toast'
import { signUp } from '@/services/auth'
import { isEmail, passwordError } from '@/utils/validators'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const nav = useNavigate()
  const toast = useToast()
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' })
  const [terms, setTerms] = useState(false)
  const [err, setErr] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [server, setServer] = useState('')
  
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value })

  // Registrasi Manual (Email & Password)
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

    toast('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.')
    nav('/login')
  }

  // Registrasi / Login via Google OAuth
  async function handleGoogleLogin() {
    if (!supabase) return
    setGoogleLoading(true)
    setServer('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setGoogleLoading(false)
      setServer(`Gagal daftar dengan Google: ${error.message}`)
    }
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
        
        <button className="btn-primary w-full" disabled={loading || googleLoading}>
          {loading ? 'Memproses…' : 'Daftar Gratis'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted">Atau mendaftar dengan</span>
          </div>
        </div>

        <button 
          type="button" 
          className="btn-ghost flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition-colors hover:bg-border/20"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.14C3.16 21.32 7.23 24 12 24z" />
            <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.18C.43 8.12 0 9.81 0 12s.43 3.88 1.18 5.38l4.09-3.14z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.16 2.68 1.18 6.62l4.09 3.14c.95-2.85 3.6-4.96 6.73-4.96z" />
          </svg>
          {googleLoading ? 'Mengarahkan ke Google…' : 'Lanjutkan dengan Google'}
        </button>
      </form>
    </AuthCard>
  )
}
