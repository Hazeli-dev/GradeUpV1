import { useMemo, useState, type FormEvent } from 'react'
import { BookOpen, Pencil, Trash2, FileText, File, UploadCloud, Star } from 'lucide-react'
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

// Kita extend tipe bawaan agar bisa menerima field Kelas & Premium tanpa memodifikasi file admin.ts
type CourseFormState = AdminCourse & { premium?: boolean; grade?: string }

export default function Courses() {
  const toast = useToast()
  const courses = useStore(coursesStore) as CourseFormState[]
  const cats = useStore(categoriesStore)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [status, setStatus] = useState('')
  const [edit, setEdit] = useState<{ c: CourseFormState; isNew: boolean } | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [del, setDel] = useState<CourseFormState | null>(null)

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
        grade: '', // Field Kelas baru
        lessons: 1,
        status: 'Draf',
        contentType: 'text',
        content: '',
        fileName: '',
        fileUrl: '',
        premium: false, // Field Akses (Free/Premium)
      },
    })
  }

  function save(e: FormEvent) {
    e.preventDefault()
    if (!edit) return
    const er: Record<string, string> = {}
    if (edit.c.title.trim().length < 3) er.title = 'Judul minimal 3 karakter'
    if (!edit.c.category) er.category = 'Pilih kategori terlebih dahulu'
    if (!edit.c.grade) er.grade = 'Isi kelas (misal: 10, 11, 12)'
    if (!(edit.c.lessons >= 1 && edit.c.lessons <= 100)) er.lessons = 'Isi 1 sampai 100 pelajaran'
    
    if (edit.c.contentType === 'text' && (!edit.c.content || edit.c.content.trim().length < 10)) {
      er.content = 'Materi teks minimal 10 karakter'
    }
    if (edit.c.contentType === 'file' && !edit.c.fileName) {
      er.file = 'Silakan unggah file materi'
    }

    setErr(er)
    if (Object.keys(er).length) return
    
    const finalData = edit.isNew ? [edit.c, ...courses] : courses.map((x) => (x.id === edit.c.id ? edit.c : x))
    coursesStore.set(finalData as AdminCourse[])
    
    toast(edit.isNew ? 'Materi berhasil ditambahkan' : 'Materi berhasil diperbarui')
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
        <button className="btn-primary" onClick={openNew}>+ Tambah Materi</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_200px_150px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari judul materi..." />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategori">
          <option value="">Semua kategori</option>
          {catNames.map((c) => <option key={c}>{c}</option>)}
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
            <div key={c.id} className="card flex flex-col gap-3 p-4 relative overflow-hidden">
              {c.premium && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-amber-400 px-2 py-1 text-[10px] font-bold text-amber-950 shadow-sm z-10">
                  <Star size={10} className="fill-amber-950" /> PREMIUM
                </div>
              )}
              <div className="gradient-brand grid h-24 place-items-center rounded-xl text-white/90">
                <BookOpen size={30} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-primary">{c.category} · {c.level} (Kelas {c.grade || '-'})</p>
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
              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button
                  className="btn-ghost flex-1 border border-border"
                  onClick={() => { setErr({}); setEdit({ isNew: false, c: { contentType: 'text', premium: false, grade: '', ...c } }) }}
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

      {/* MODAL (Diperlebar dengan lg:min-w-[800px]) */}
      <Modal open={edit !== null} onClose={() => setEdit(null)} title={edit?.isNew ? 'Tambah Materi Baru' : 'Ubah Data Materi'}>
        {edit && (
          <form onSubmit={save} noValidate className="space-y-4 sm:min-w-[500px] lg:min-w-[800px]">
            <Field label="Judul Materi" name="title" value={edit.c.title} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, title: e.target.value } })} error={err.title} />
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <SelectField name="category" label="Kategori" value={edit.c.category} options={catNames} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, category: v } })} />
              <SelectField name="level" label="Jenjang" value={edit.c.level} options={levels} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, level: v as AdminCourse['level'] } })} />
              <Field label="Kelas (Misal: 10)" name="grade" value={edit.c.grade || ''} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, grade: e.target.value } })} error={err.grade} />
              <SelectField name="access" label="Akses Paket" value={edit.c.premium ? 'Premium' : 'Gratis'} options={['Gratis', 'Premium']} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, premium: v === 'Premium' } })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Jumlah Pelajaran / Bab" name="lessons" type="number" value={edit.c.lessons} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, lessons: Number(e.target.value) } })} error={err.lessons} />
              <SelectField name="status" label="Status Publikasi" value={edit.c.status} options={['Terbit', 'Draf']} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, status: v as AdminCourse['status'] } })} />
            </div>
            
            {/* TABS TIPE MATERI */}
            <div className="pt-4 border-t border-slate-200">
              <label className="mb-3 block text-sm font-bold text-slate-800">Tipe Isi Materi</label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input type="radio" className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" checked={edit.c.contentType === 'text' || !edit.c.contentType} onChange={() => setEdit({ ...edit, c: { ...edit.c, contentType: 'text' } })} />
                  Ketik Manual (Teks Lengkap)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input type="radio" className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" checked={edit.c.contentType === 'file'} onChange={() => setEdit({ ...edit, c: { ...edit.c, contentType: 'file' } })} />
                  Upload Dokumen
                </label>
              </div>
            </div>

            {/* AREA KERJA EDITOR / UPLOAD */}
            {edit.c.contentType === 'text' || !edit.c.contentType ? (
              <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                <textarea
                  className={`w-full rounded-lg min-h-[40vh] resize-y p-6 text-base leading-relaxed text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 border-0 ${err.content ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Ketik isi materi di sini layaknya menggunakan Microsoft Word..."
                  value={edit.c.content || ''}
                  onChange={(e) => setEdit({ ...edit, c: { ...edit.c, content: e.target.value } })}
                />
                {err.content && <p className="mt-1 text-xs text-red-500 px-2">{err.content}</p>}
              </div>
            ) : (
              <div className={`relative flex flex-col items-center justify-center w-full min-h-[30vh] border-2 border-dashed rounded-xl bg-slate-50 transition-colors hover:bg-slate-100 ${err.file ? 'border-red-400' : 'border-slate-300'}`}>
                <UploadCloud className="w-14 h-14 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-600 mb-1">Pilih atau letakkan file PDF/Word di sini</p>
                <p className="text-xs text-slate-400 mb-4">Maksimal ukuran file: 10MB</p>
                <label className="cursor-pointer bg-white border border-slate-300 shadow-sm px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  Cari Dokumen
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                </label>
                {edit.c.fileName && (
                  <div className="absolute bottom-4 flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-1.5 text-emerald-800 text-sm font-medium shadow-sm">
                    <File size={16} /> {edit.c.fileName}
                  </div>
                )}
                {err.file && <p className="absolute bottom-1 text-xs text-red-500">{err.file}</p>}
              </div>
            )}

            <button className="btn-primary w-full py-3 mt-4 text-base shadow-lg">Simpan Materi</button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        danger
        title="Hapus materi?"
        confirmLabel="Hapus"
        message={`“${del?.title ?? ''}” akan dihapus secara permanen.`}
        onConfirm={() => {
          if (del) {
            const newCourses = courses.filter((x) => x.id !== del.id)
            coursesStore.set(newCourses as AdminCourse[])
            toast('Materi dihapus')
          }
        }}
      />
    </div>
  )
}
