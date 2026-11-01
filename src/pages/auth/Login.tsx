import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard, { ServerError } from '@/components/AuthCard'
import Field from '@/components/Field'
import { useToast } from '@/components/Toast'
import { signIn } from '@/services/auth'
import { isEmail } from '@/utils/validators'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const nav = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [server, setServer] = useState('')

  // Login dengan Email & Password
  async function submit(e: FormEvent) {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!isEmail(email)) er.email = 'Masukkan email yang valid'
    if (!password) er.password = 'Kata sandi wajib diisi'
    setErr(er)
    setServer('')
    if (Object.keys(er).length) return

    setLoading(true)
    const r = await signIn(email.trim(), password)

    if (!r.ok || !r.data?.user) {
      setLoading(false)
      return setServer(r.message ?? 'Gagal masuk. Periksa email dan kata sandi.')
    }

    // Ambil data role pengguna dari tabel profiles di Supabase dengan null safety
    let userRole = 'student'
    if (supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', r.data.user.id)
        .single()
      
      if (profile?.role) {
        userRole = profile.role
      }
    }

    setLoading(false)
    toast('Berhasil masuk!')

    // Pengalihan berdasarkan role
    if (userRole === 'admin') {
      nav('/admin')
    } else {
      nav('/dashboard')
    }
  }

  // Login dengan Google OAuth
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
      setServer(`Gagal masuk dengan Google: ${error.message}`)
    }
  }

  return (
    <AuthCard
      title="Masuk ke GradeUp"
      subtitle="Lanjutkan belajar dari terakhir kamu berhenti."
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-primary">
            Daftar Gratis
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <ServerError message={server} />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={err.email}
        />
        <Field
          label="Kata sandi"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={err.password}
        />
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-primary">
            Lupa kata sandi?
          </Link>
        </div>
        <button className="btn-primary w-full" disabled={loading || googleLoading}>
          {loading ? 'Memproses…' : 'Masuk'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted">Atau masuk dengan</span>
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
