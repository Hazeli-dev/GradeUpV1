import { useState, type FormEvent } from 'react'
import Field from '@/components/Field'
import PageHeader from '@/components/PageHeader'
import { useToast } from '@/components/Toast'
import { isEmail } from '@/utils/validators'

export default function Contact() {
  const toast = useToast()
  const [v, setV] = useState({ name: '', email: '', message: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value })

  function submit(e: FormEvent) {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (v.name.trim().length < 2) er.name = 'Nama minimal 2 karakter'
    if (!isEmail(v.email)) er.email = 'Masukkan email yang valid'
    if (v.message.trim().length < 10) er.message = 'Pesan minimal 10 karakter'
    setErr(er)
    if (Object.keys(er).length) return
    setV({ name: '', email: '', message: '' })
    toast('Pesan diterima di mode demo. Belum dikirim ke server.', 'info')
  }

  return (
    <>
      <PageHeader title="Kontak" subtitle="Ada pertanyaan atau masukan? Tulis di sini." />
      <form onSubmit={submit} noValidate className="card mx-auto my-12 max-w-xl space-y-4 p-6">
        <Field label="Nama" name="name" value={v.name} onChange={set('name')} error={err.name} />
        <Field label="Email" name="email" type="email" value={v.email} onChange={set('email')} error={err.email} />
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">Pesan</label>
          <textarea id="message" rows={5} className="input" value={v.message} onChange={set('message')} aria-invalid={Boolean(err.message)} />
          {err.message && <p className="mt-1 text-xs text-red-500">{err.message}</p>}
        </div>
        <button className="btn-primary w-full">Kirim pesan</button>
      </form>
    </>
  )
}
