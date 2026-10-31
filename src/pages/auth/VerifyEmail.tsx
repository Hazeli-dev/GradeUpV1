import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import AuthCard from '@/components/AuthCard'
import { useToast } from '@/components/Toast'
import { resendVerification } from '@/services/auth'

export default function VerifyEmail() {
  const toast = useToast()
  const email = useSearchParams()[0].get('email') ?? ''
  const [loading, setLoading] = useState(false)

  async function resend() {
    if (!email) return toast('Alamat email tidak ditemukan. Daftar ulang untuk mengirim verifikasi.', 'error')
    setLoading(true)
    const r = await resendVerification(email)
    setLoading(false)
    toast(r.ok ? 'Email verifikasi dikirim ulang.' : r.message ?? 'Gagal mengirim ulang.', r.ok ? 'success' : 'error')
  }

  return (
    <AuthCard title="Cek email kamu" footer={<Link to="/login" className="font-semibold text-primary">Ke halaman masuk</Link>}>
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-primary"><MailCheck size={26} /></span>
        <p className="mt-4 text-sm text-muted">Kami mengirim tautan verifikasi{email && <> ke <b className="text-text">{email}</b></>}. Klik tautan itu untuk mengaktifkan akun.</p>
        <button className="btn-ghost mt-5 border border-border" onClick={resend} disabled={loading}>{loading ? 'Mengirim…' : 'Kirim ulang email'}</button>
      </div>
    </AuthCard>
  )
}
