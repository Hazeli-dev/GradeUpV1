import { useMemo, useState, type FormEvent } from 'react'
import { usersStore, type AdminUser } from '@/data/admin'
import { levels } from '@/data/demo'
import { useStore } from '@/lib/store'
import ConfirmDialog from '@/components/ConfirmDialog'
import Field from '@/components/Field'
import Modal from '@/components/Modal'
import SearchBox from '@/components/SearchBox'
import { SelectField } from '@/components/SelectField'
import StatusBadge from '@/components/StatusBadge'
import { useToast } from '@/components/Toast'
import { fmtDate } from '@/utils/format'
import { isEmail } from '@/utils/validators'

export default function Users() {
  const toast = useToast(); const users = useStore(usersStore)
  const [q, setQ] = useState(''); const [plan, setPlan] = useState(''); const [status, setStatus] = useState('')
  const [draft, setDraft] = useState<AdminUser | null>(null); const [err, setErr] = useState<Record<string, string>>({}); const [confirm, setConfirm] = useState(false)
  const list = useMemo(() => users.filter((u) => (u.name + u.email).toLowerCase().includes(q.trim().toLowerCase()) && (!plan || u.plan === plan) && (!status || u.status === status)), [users, q, plan, status])
  const update = (u: AdminUser) => usersStore.set(usersStore.get().map((x) => (x.id === u.id ? u : x)))

  function save(e: FormEvent) {
    e.preventDefault()
    if (!draft) return
    const er: Record<string, string> = {}
    if (draft.name.trim().length < 2) er.name = 'Nama minimal 2 karakter'
    if (!isEmail(draft.email)) er.email = 'Masukkan email yang valid'
    setErr(er)
    if (Object.keys(er).length) return
    update(draft); setDraft(null); toast('Profil pengguna diperbarui')
  }
  const toggle = () => {
    if (!draft) return
    const next = { ...draft, status: draft.status === 'Aktif' ? 'Ditangguhkan' : 'Aktif' } as AdminUser
    update(next); setDraft(null); toast(next.status === 'Aktif' ? 'Pengguna diaktifkan' : 'Pengguna ditangguhkan')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Pengguna</h1>
      <div className="grid gap-3 sm:grid-cols-[1fr_150px_170px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nama atau email" />
        <select className="input" value={plan} onChange={(e) => setPlan(e.target.value)} aria-label="Paket"><option value="">Semua paket</option><option>Gratis</option><option>Premium</option></select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">Semua status</option><option>Aktif</option><option>Ditangguhkan</option></select>
      </div>
      {list.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Tidak ada pengguna yang cocok.</p> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
          <thead><tr className="border-b border-border text-muted"><th className="p-4">Pengguna</th><th className="p-4">Jenjang</th><th className="p-4">Paket</th><th className="p-4">Status</th><th className="p-4">Bergabung</th><th className="p-4" /></tr></thead>
          <tbody>{list.map((u) => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <td className="p-4"><b>{u.name}</b><br /><span className="text-xs text-muted">{u.email}</span></td><td className="p-4">{u.level}</td>
              <td className="p-4"><StatusBadge label={u.plan} /></td><td className="p-4"><StatusBadge label={u.status} /></td><td className="p-4 text-muted">{fmtDate(u.joined)}</td>
              <td className="p-4 text-right"><button className="font-semibold text-primary" onClick={() => { setErr({}); setDraft(u) }}>Detail</button></td>
            </tr>))}</tbody></table></div>)}
      <Modal open={draft !== null} onClose={() => setDraft(null)} title="Detail pengguna">
        {draft && (
          <form onSubmit={save} noValidate className="space-y-3">
            <Field label="Nama" name="name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} error={err.name} />
            <Field label="Email" name="email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} error={err.email} />
            <div className="grid grid-cols-2 gap-3">
              <SelectField name="level" label="Jenjang" value={draft.level} options={levels} onChange={(v) => setDraft({ ...draft, level: v as AdminUser['level'] })} />
              <SelectField name="plan" label="Paket" value={draft.plan} options={['Gratis', 'Premium']} onChange={(v) => setDraft({ ...draft, plan: v as AdminUser['plan'] })} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" className="btn-ghost flex-1 border border-border" onClick={() => setConfirm(true)}>{draft.status === 'Aktif' ? 'Tangguhkan' : 'Aktifkan'}</button>
              <button className="btn-primary flex-1">Simpan</button>
            </div>
          </form>)}
      </Modal>
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={toggle} danger={draft?.status === 'Aktif'}
        title={draft?.status === 'Aktif' ? 'Tangguhkan pengguna?' : 'Aktifkan pengguna?'} confirmLabel={draft?.status === 'Aktif' ? 'Tangguhkan' : 'Aktifkan'}
        message={draft?.status === 'Aktif' ? 'Pengguna tidak akan bisa masuk sampai diaktifkan kembali.' : 'Pengguna akan bisa masuk kembali.'} />
    </div>
  )
}
