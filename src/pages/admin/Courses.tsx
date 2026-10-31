import { useMemo, useState, type FormEvent } from 'react'
import { BookOpen, Pencil, Trash2 } from 'lucide-react'
import { categoriesStore, coursesStore, type AdminCourse } from '@/data/admin'
import { levels } from '@/data/demo'
import { uid, useStore } from '@/lib/store'
import ConfirmDialog from '@/components/ConfirmDialog'
import Field from '@/components/Field'
import Modal from '@/components/Modal'
import SearchBox from '@/components/SearchBox'
import { SelectField } from '@/components/SelectField'
import StatusBadge from '@/components/StatusBadge'
import { useToast } from '@/components/Toast'

export default function Courses() {
  const toast = useToast(); const courses = useStore(coursesStore); const cats = useStore(categoriesStore)
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [status, setStatus] = useState('')
  const [edit, setEdit] = useState<{ c: AdminCourse; isNew: boolean } | null>(null); const [err, setErr] = useState<Record<string, string>>({}); const [del, setDel] = useState<AdminCourse | null>(null)
  const list = useMemo(() => courses.filter((c) => c.title.toLowerCase().includes(q.trim().toLowerCase()) && (!cat || c.category === cat) && (!status || c.status === status)), [courses, q, cat, status])
  const catNames = cats.map((c) => c.name)

  const openNew = () => { setErr({}); setEdit({ isNew: true, c: { id: uid(), title: '', category: catNames[0] ?? '', level: 'SMP', lessons: 10, status: 'Draf' } }) }
  function save(e: FormEvent) {
    e.preventDefault()
    if (!edit) return
    const er: Record<string, string> = {}
    if (edit.c.title.trim().length < 3) er.title = 'Judul minimal 3 karakter'
    if (!edit.c.category) er.category = 'Buat kategori terlebih dahulu'
    if (!(edit.c.lessons >= 1 && edit.c.lessons <= 100)) er.lessons = 'Isi 1 sampai 100 pelajaran'
    setErr(er)
    if (Object.keys(er).length) return
    coursesStore.set(edit.isNew ? [edit.c, ...courses] : courses.map((x) => (x.id === edit.c.id ? edit.c : x)))
    toast(edit.isNew ? 'Materi ditambahkan' : 'Materi diperbarui'); setEdit(null)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-extrabold tracking-tight">Manajemen Materi</h1><button className="btn-primary" onClick={openNew}>Tambah materi</button></div>
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_150px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari judul materi" />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategori"><option value="">Semua kategori</option>{catNames.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">Semua status</option><option>Terbit</option><option>Draf</option></select>
      </div>
      {list.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Tidak ada materi yang cocok.</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => (
          <div key={c.id} className="card flex flex-col gap-3 p-4">
            <div className="gradient-brand grid h-24 place-items-center rounded-xl text-white/90"><BookOpen size={30} /></div>
            <div className="flex items-center justify-between"><p className="text-xs font-semibold text-primary">{c.category} · {c.level}</p><StatusBadge label={c.status} /></div>
            <h3 className="flex-1 font-bold leading-snug">{c.title}</h3>
            <p className="text-xs text-muted">{c.lessons} pelajaran</p>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1 border border-border" onClick={() => { setErr({}); setEdit({ isNew: false, c }) }}><Pencil size={14} />Ubah</button>
              <button className="btn-ghost border border-border text-red-600" onClick={() => setDel(c)} aria-label={`Hapus ${c.title}`}><Trash2 size={14} /></button>
            </div>
          </div>))}</div>)}
      <Modal open={edit !== null} onClose={() => setEdit(null)} title={edit?.isNew ? 'Tambah materi' : 'Ubah materi'}>
        {edit && (
          <form onSubmit={save} noValidate className="space-y-3">
            <Field label="Judul" name="title" value={edit.c.title} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, title: e.target.value } })} error={err.title} />
            <SelectField name="category" label="Kategori" value={edit.c.category} options={catNames} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, category: v } })} />
            {err.category && <p className="text-xs text-red-500">{err.category}</p>}
            <div className="grid grid-cols-2 gap-3">
              <SelectField name="level" label="Jenjang" value={edit.c.level} options={levels} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, level: v as AdminCourse['level'] } })} />
              <SelectField name="status" label="Status" value={edit.c.status} options={['Terbit', 'Draf']} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, status: v as AdminCourse['status'] } })} />
            </div>
            <Field label="Jumlah pelajaran" name="lessons" type="number" value={edit.c.lessons} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, lessons: Number(e.target.value) } })} error={err.lessons} />
            <button className="btn-primary w-full">Simpan</button>
          </form>)}
      </Modal>
      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} danger title="Hapus materi?" confirmLabel="Hapus"
        message={`“${del?.title ?? ''}” akan dihapus dari daftar. Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={() => { if (del) { coursesStore.set(courses.filter((x) => x.id !== del.id)); toast('Materi dihapus') } }} />
    </div>
  )
}
