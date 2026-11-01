import { useMemo, useState, type FormEvent } from 'react'
import { BookOpen, Pencil, Trash2, FileText, File, Upload } from 'lucide-react'
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
  const toast = useToast()
  const courses = useStore(coursesStore)
  const cats = useStore(categoriesStore)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [status, setStatus] = useState('')
  const [edit, setEdit] = useState<{ c: AdminCourse; isNew: boolean } | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [del, setDel] = useState<AdminCourse | null>(null)

  const list = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q.trim().toLowerCase()) &&
          (!cat || c.category === cat) &&
          (!status || c.status === status)
      ),
    [courses, q, cat, status]
  )
  const catNames = cats.map((c) => c.name)

  const openNew = () => {
    setErr({})
    setEdit({
      isNew: true,
      c: {
        id: uid(),
        title: '',
        category: catNames[0] ?? '',
        level: 'SMP',
        lessons: 10,
        status: 'Draf',
        contentType: 'text',
        content: '',
        fileName: '',
        fileUrl: '',
      },
    })
  }

  function save(e: FormEvent) {
    e.preventDefault()
    if (!edit) return
    const er: Record<string, string> = {}
    if (edit.c.title.trim().length < 3) er.title = 'Judul minimal 3 karakter'
    if (!edit.c.category) er.category = 'Buat kategori terlebih dahulu'
    if (!(edit.c.lessons >= 1 && edit.c.lessons <= 100)) er.lessons = 'Isi 1 sampai 100 pelajaran'
    
    if (edit.c.contentType === 'text' && (!edit.c.content || edit.c.content.trim().length < 10)) {
      er.content = 'Materi teks minimal 10 karakter'
    }
    if (edit.c.contentType === 'file' && !edit.c.fileName) {
      er.file = 'Silakan unggah file materi'
    }

    setErr(er)
    if (Object.keys(er).length) return
    coursesStore.set(edit.isNew ? [edit.c, ...courses] : courses.map((x) => (x.id === edit.c.id ? edit.c : x)))
    toast(edit.isNew ? 'Materi ditambahkan' : 'Materi diperbarui')
    setEdit(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fakeUrl = URL.createObjectURL(file)
      setEdit((prev) => prev ? { ...prev, c: { ...prev.c, fileName: file.name, fileUrl: fakeUrl } } : null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Materi</h1>
        <button className="btn-primary" onClick={openNew}>Tambah materi</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_150px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari judul materi" />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategori">
          <option value="">Semua kategori</option>
          {catNames.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">Semua status</option>
          <option>Terbit</option>
          <option>Draf</option>
        </select>
      </div>
      {list.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">Tidak ada materi yang cocok.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <div key={c.id} className="card flex flex-col gap-3 p-4">
              <div className="gradient-brand grid h-24 place-items-center rounded-xl text-white/90">
                <BookOpen size={30} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-primary">{c.category} · {c.level}</p>
                <StatusBadge label={c.status} />
              </div>
              <h3 className="flex-1 font-bold leading-snug">{c.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">{c.lessons} pelajaran</p>
                {c.contentType === 'file' ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-blue-600"><File size={14} /> Dokumen</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><FileText size={14} /> Teks</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-ghost flex-1 border border-border"
                  onClick={() => { setErr({}); setEdit({ isNew: false, c: { contentType: 'text', ...c } }) }}
                >
                  <Pencil size={14} />Ubah
                </button>
                <button
                  className="btn-ghost border border-border text-red-600"
                  onClick={() => setDel(c)}
                  aria-label={`Hapus ${c.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
            
            <div className="pt-2 border-t border-slate-100">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Tipe Isi Materi</label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" className="text-emerald-600 focus:ring-emerald-600" checked={edit.c.contentType === 'text' || !edit.c.contentType} onChange={() => setEdit({ ...edit, c: { ...edit.c, contentType: 'text' } })} />
                  Ketik Manual (Teks)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" className="text-emerald-600 focus:ring-emerald-600" checked={edit.c.contentType === 'file'} onChange={() => setEdit({ ...edit, c: { ...edit.c, contentType: 'file' } })} />
                  Upload Dokumen (PDF)
                </label>
              </div>
            </div>

            {edit.c.contentType === 'text' || !edit.c.contentType ? (
              <div className="space-y-1">
                <textarea
                  className={`input min-h-[150px] resize-y w-full ${err.content ? 'border-red-500' : ''}`}
                  placeholder="Ketik isi materi di sini..."
                  value={edit.c.content || ''}
                  onChange={(e) => setEdit({ ...edit, c: { ...edit.c, content: e.target.value } })}
                />
                {err.content && <p className="text-xs text-red-500">{err.content}</p>}
              </div>
            ) : (
              <div className="space-y-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                <Upload className="mx-auto mb-2 text-slate-400" size={24} />
                <p className="text-sm text-slate-600">
                  {edit.c.fileName ? (
                    <span className="font-semibold text-emerald-600">File terpilih: {edit.c.fileName}</span>
                  ) : (
                    "Klik di bawah untuk memilih file (PDF/Doc)"
                  )}
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="mx-auto block w-full max-w-xs text-xs file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {err.file && <p className="text-xs text-red-500">{err.file}</p>}
              </div>
            )}

            <button className="btn-primary w-full mt-2">Simpan</button>
          </form>
        )}
      </Modal>
      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        danger
        title="Hapus materi?"
        confirmLabel="Hapus"
        message={`“${del?.title ?? ''}” akan dihapus dari daftar. Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={() => {
          if (del) {
            coursesStore.set(courses.filter((x) => x.id !== del.id))
            toast('Materi dihapus')
          }
        }}
      />
    </div>
  )
}
