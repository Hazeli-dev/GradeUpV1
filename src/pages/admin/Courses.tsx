import { useMemo, useState, type FormEvent } from 'react'
import { BookOpen, Pencil, Trash2, FileText, File, UploadCloud, Star, Eye } from 'lucide-react'
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

type CourseFormState = AdminCourse & { premium?: boolean; grade?: string }

export default function Courses() {
  const toast = useToast()
  const courses = useStore(coursesStore) as CourseFormState[]
  const cats = useStore(categoriesStore)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [status, setStatus] = useState('')
  
  const [edit, setEdit] = useState<{ c: CourseFormState; isNew: boolean } | null>(null)
  const [preview, setPreview] = useState<CourseFormState | null>(null)
  const [del, setDel] = useState<CourseFormState | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})

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
        grade: '',
        lessons: 1,
        status: 'Draf',
        contentType: 'text',
        content: '',
        fileName: '',
        fileUrl: '',
        premium: false,
      },
    })
  }

  function save(e: FormEvent) {
    e.preventDefault()
    if (!edit) return
    const er: Record<string, string> = {}
    if (edit.c.title.trim().length < 3) er.title = 'Judul minimal 3 karakter'
    if (!edit.c.category) er.category = 'Pilih kategori'
    if (!edit.c.grade) er.grade = 'Isi kelas'
    if (!(edit.c.lessons >= 1 && edit.c.lessons <= 100)) er.lessons = 'Isi 1 - 100'
    
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
                  <span className="flex items-center gap-1 text-xs font-medium text-blue-500"><File size={14} /> Dokumen</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-500"><FileText size={14} /> Teks</span>
                )}
              </div>
              
              {/* TOMBOL ACTION DENGAN PREVIEW */}
              <div className="flex gap-2 border-t border-border pt-3">
                <button
                  className="btn-ghost flex-1 border border-border text-blue-500"
                  onClick={() => setPreview(c)}
                >
                  <Eye size={14} />Lihat
                </button>
                <button
                  className="btn-ghost flex-1 border border-border"
                  onClick={() => { setErr({}); setEdit({ isNew: false, c: { contentType: 'text', premium: false, grade: '', ...c } }) }}
                >
                  <Pencil size={14} />Ubah
                </button>
                <button
                  className="btn-ghost w-10 border border-border text-red-500 flex items-center justify-center"
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

      {/* MODAL PREVIEW MATERI */}
      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Preview Tampilan Materi">
        {preview && (
          <div className="space-y-4 w-full max-h-[75vh] overflow-y-auto px-2 py-1">
            <div className="border-b border-border pb-4">
              <h2 className="text-xl font-bold text-foreground">{preview.title}</h2>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">{preview.category}</span>
                <span className="bg-muted px-2 py-1 rounded font-medium">{preview.level} {preview.grade ? `(Kelas ${preview.grade})` : ''}</span>
                {preview.premium && (
                  <span className="bg-amber-400/20 text-amber-600 px-2 py-1 rounded font-bold flex items-center gap-1">
                    <Star size={12} /> Premium
                  </span>
                )}
              </div>
            </div>
            <div className="pt-2">
              {preview.contentType === 'file' ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl bg-muted/30">
                  <File size={40} className="text-blue-500 mb-3" />
                  <p className="font-semibold text-sm mb-4">{preview.fileName}</p>
                  {preview.fileUrl ? (
                    <a href={preview.fileUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm px-6 py-2">
                      Buka File Dokumen
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground">File belum diunggah</p>
                  )}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-5 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed text-foreground shadow-sm">
                  {preview.content || <span className="text-muted-foreground italic">Isi materi masih kosong...</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL FORM TAMBAH/UBAH */}
      <Modal open={edit !== null} onClose={() => setEdit(null)} title={edit?.isNew ? 'Tambah Materi Baru' : 'Ubah Data Materi'}>
        {edit && (
          <form onSubmit={save} noValidate className="space-y-4 w-full max-h-[75vh] overflow-y-auto px-2 py-1">
            <Field label="Judul Materi" name="title" value={edit.c.title} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, title: e.target.value } })} error={err.title} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField name="category" label="Kategori" value={edit.c.category} options={catNames} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, category: v } })} />
              <SelectField name="level" label="Jenjang" value={edit.c.level} options={levels} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, level: v as AdminCourse['level'] } })} />
              <Field label="Kelas (Misal: 10)" name="grade" value={edit.c.grade || ''} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, grade: e.target.value } })} error={err.grade} />
              <SelectField name="access" label="Akses Paket" value={edit.c.premium ? 'Premium' : 'Gratis'} options={['Gratis', 'Premium']} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, premium: v === 'Premium' } })} />
              <Field label="Jumlah Pelajaran / Bab" name="lessons" type="number" value={edit.c.lessons} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, lessons: Number(e.target.value) } })} error={err.lessons} />
              <SelectField name="status" label="Status Publikasi" value={edit.c.status} options={['Terbit', 'Draf']} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, status: v as AdminCourse['status'] } })} />
            </div>
            
            <div className="pt-4 border-t border-border">
              <label className="mb-3 block text-sm font-bold">Tipe Isi Materi</label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input type="radio" className="h-4 w-4 text-primary focus:ring-primary" checked={edit.c.contentType === 'text' || !edit.c.contentType} onChange={() => setEdit({ ...edit, c: { ...edit.c, contentType: 'text' } })} />
                  Ketik Manual (Teks)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input type="radio" className="h-4 w-4 text-primary focus:ring-primary" checked={edit.c.contentType === 'file'} onChange={() => setEdit({ ...edit, c: { ...edit.c, contentType: 'file' } })} />
                  Upload Dokumen
                </label>
              </div>
            </div>

            {edit.c.contentType === 'text' || !edit.c.contentType ? (
              <div className="space-y-1 mt-2">
                <textarea
                  className={`input w-full rounded-lg min-h-[200px] resize-y p-3 text-sm leading-relaxed ${err.content ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Ketik isi materi di sini..."
                  value={edit.c.content || ''}
                  onChange={(e) => setEdit({ ...edit, c: { ...edit.c, content: e.target.value } })}
                />
                {err.content && <p className="text-xs text-red-500">{err.content}</p>}
              </div>
            ) : (
              <div className={`relative flex flex-col items-center justify-center w-full min-h-[160px] mt-2 border-2 border-dashed rounded-xl transition-colors bg-card hover:bg-muted ${err.file ? 'border-red-500' : 'border-border'}`}>
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Pilih / letakkan file PDF</p>
                <p className="text-xs text-muted-foreground mb-3">Maks: 10MB</p>
                <label className="cursor-pointer btn-secondary px-3 py-1.5 rounded-lg text-sm font-semibold transition">
                  Cari Dokumen
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                </label>
                {edit.c.fileName && (
                  <div className="absolute bottom-2 flex items-center gap-2 rounded-md bg-emerald-500/20 px-2 py-1 text-emerald-500 border border-emerald-500/30 text-xs font-medium shadow-sm">
                    <File size={14} /> {edit.c.fileName}
                  </div>
                )}
                {err.file && <p className="absolute bottom-1 text-xs text-red-500">{err.file}</p>}
              </div>
            )}

            <button className="btn-primary w-full py-2.5 mt-4 text-sm">Simpan Materi</button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        danger
        title="Hapus materi?"
