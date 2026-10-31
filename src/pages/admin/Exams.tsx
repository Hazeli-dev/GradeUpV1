import { useMemo, useState, type FormEvent } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { examsStore, type AdminExam } from '@/data/admin'
import { levels } from '@/data/demo'
import { uid, useStore } from '@/lib/store'
import ConfirmDialog from '@/components/ConfirmDialog'
import Field from '@/components/Field'
import Modal from '@/components/Modal'
import SearchBox from '@/components/SearchBox'
import { SelectField } from '@/components/SelectField'
import StatusBadge from '@/components/StatusBadge'
import { useToast } from '@/components/Toast'

export default function Exams() {
  const toast = useToast(); const exams = useStore(examsStore)
  const [q, setQ] = useState(''); const [status, setStatus] = useState('')
  const [edit, setEdit] = useState<{ e: AdminExam; isNew: boolean } | null>(null); const [err, setErr] = useState<Record<string, string>>({}); const [del, setDel] = useState<AdminExam | null>(null)
  const list = useMemo(() => exams.filter((x) => x.title.toLowerCase().includes(q.trim().toLowerCase()) && (!status || x.status === status)), [exams, q, status])

  function save(ev: FormEvent) {
    ev.preventDefault()
    if (!edit) return
    const er: Record<string, string> = {}
    if (edit.e.title.trim().length < 3) er.title = 'Judul minimal 3 karakter'
    if (!(edit.e.questions >= 1 && edit.e.questions <= 200)) er.questions = 'Isi 1 sampai 200 soal'
    if (!(edit.e.minutes >= 5 && edit.e.minutes <= 240)) er.minutes = 'Durasi 5 sampai 240 menit'
    setErr(er)
    if (Object.keys(er).length) return
    examsStore.set(edit.isNew ? [edit.e, ...exams] : exams.map((x) => (x.id === edit.e.id ? edit.e : x)))
    toast(edit.isNew ? 'Paket ujian ditambahkan' : 'Paket ujian diperbarui'); setEdit(null)
  }
  const set = (p: Partial<AdminExam>) => edit && setEdit({ ...edit, e: { ...edit.e, ...p } })

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-extrabold tracking-tight">Paket Ujian</h1>
        <button className="btn-primary" onClick={() => { setErr({}); setEdit({ isNew: true, e: { id: uid(), title: '', level: 'SMP', questions: 20, minutes: 30, premium: false, status: 'Draf' } }) }}>Tambah paket</button></div>
      <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari paket ujian" />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">Semua status</option><option>Terbit</option><option>Draf</option></select>
      </div>
      {list.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Tidak ada paket ujian yang cocok.</p> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b border-border text-muted"><th className="p-4">Paket</th><th className="p-4">Jenjang</th><th className="p-4">Soal</th><th className="p-4">Durasi</th><th className="p-4">Akses</th><th className="p-4">Status</th><th className="p-4" /></tr></thead>
          <tbody>{list.map((x) => (
            <tr key={x.id} className="border-b border-border last:border-0">
              <td className="p-4 font-medium">{x.title}</td><td className="p-4">{x.level}</td><td className="p-4">{x.questions}</td><td className="p-4">{x.minutes} menit</td>
              <td className="p-4">{x.premium ? 'Premium' : 'Gratis'}</td><td className="p-4"><StatusBadge label={x.status} /></td>
              <td className="p-4"><div className="flex justify-end gap-1">
                <button className="btn-ghost h-9 w-9 !p-0" aria-label={`Ubah ${x.title}`} onClick={() => { setErr({}); setEdit({ isNew: false, e: x }) }}><Pencil size={15} /></button>
                <button className="btn-ghost h-9 w-9 !p-0 text-red-600" aria-label={`Hapus ${x.title}`} onClick={() => setDel(x)}><Trash2 size={15} /></button></div></td>
            </tr>))}</tbody></table></div>)}
      <Modal open={edit !== null} onClose={() => setEdit(null)} title={edit?.isNew ? 'Tambah paket ujian' : 'Ubah paket ujian'}>
        {edit && (
          <form onSubmit={save} noValidate className="space-y-3">
            <Field label="Judul" name="title" value={edit.e.title} onChange={(e) => set({ title: e.target.value })} error={err.title} />
            <div className="grid grid-cols-2 gap-3">
              <SelectField name="level" label="Jenjang" value={edit.e.level} options={levels} onChange={(v) => set({ level: v as AdminExam['level'] })} />
              <SelectField name="status" label="Status" value={edit.e.status} options={['Terbit', 'Draf']} onChange={(v) => set({ status: v as AdminExam['status'] })} />
              <Field label="Jumlah soal" name="questions" type="number" value={edit.e.questions} onChange={(e) => set({ questions: Number(e.target.value) })} error={err.questions} />
              <Field label="Durasi (menit)" name="minutes" type="number" value={edit.e.minutes} onChange={(e) => set({ minutes: Number(e.target.value) })} error={err.minutes} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.e.premium} onChange={(e) => set({ premium: e.target.checked })} />Khusus Premium</label>
            <button className="btn-primary w-full">Simpan</button>
          </form>)}
      </Modal>
      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} danger title="Hapus paket ujian?" confirmLabel="Hapus"
        message={`“${del?.title ?? ''}” akan dihapus dari daftar.`} onConfirm={() => { if (del) { examsStore.set(exams.filter((x) => x.id !== del.id)); toast('Paket ujian dihapus') } }} />
    </div>
  )
}
