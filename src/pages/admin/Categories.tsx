import { useState, type FormEvent } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { categoriesStore, coursesStore, type Category } from '@/data/admin'
import { uid, useStore } from '@/lib/store'
import ConfirmDialog from '@/components/ConfirmDialog'
import Field from '@/components/Field'
import Modal from '@/components/Modal'
import { TextArea } from '@/components/SelectField'
import { useToast } from '@/components/Toast'

export default function Categories() {
  const toast = useToast(); const cats = useStore(categoriesStore); const courses = useStore(coursesStore)
  const [edit, setEdit] = useState<{ c: Category; isNew: boolean } | null>(null); const [err, setErr] = useState<Record<string, string>>({}); const [del, setDel] = useState<Category | null>(null)
  const count = (name: string) => courses.filter((c) => c.category === name).length

  function save(e: FormEvent) {
    e.preventDefault()
    if (!edit) return
    const er: Record<string, string> = {}
    const name = edit.c.name.trim()
    if (name.length < 2) er.name = 'Nama minimal 2 karakter'
    else if (cats.some((x) => x.id !== edit.c.id && x.name.toLowerCase() === name.toLowerCase())) er.name = 'Nama kategori sudah dipakai'
    setErr(er)
    if (Object.keys(er).length) return
    const next = { ...edit.c, name }
    if (!edit.isNew) { const old = cats.find((x) => x.id === next.id); if (old && old.name !== name) coursesStore.set(courses.map((c) => (c.category === old.name ? { ...c, category: name } : c))) }
    categoriesStore.set(edit.isNew ? [...cats, next] : cats.map((x) => (x.id === next.id ? next : x)))
    toast(edit.isNew ? 'Kategori ditambahkan' : 'Kategori diperbarui'); setEdit(null)
  }
  const remove = (c: Category) => {
    if (count(c.name) > 0) return toast('Kategori masih dipakai materi. Pindahkan atau hapus materinya dulu.', 'error')
    categoriesStore.set(cats.filter((x) => x.id !== c.id)); toast('Kategori dihapus')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-extrabold tracking-tight">Kategori Materi</h1>
        <button className="btn-primary" onClick={() => { setErr({}); setEdit({ isNew: true, c: { id: uid(), name: '', description: '' } }) }}>Tambah kategori</button></div>
      {cats.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Belum ada kategori. Tambahkan yang pertama.</p> : (
        <div className="card divide-y divide-border">{cats.map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1"><p className="font-bold">{c.name}</p><p className="truncate text-sm text-muted">{c.description}</p></div>
            <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">{count(c.name)} materi</span>
            <button className="btn-ghost h-9 w-9 !p-0" aria-label={`Ubah ${c.name}`} onClick={() => { setErr({}); setEdit({ isNew: false, c }) }}><Pencil size={15} /></button>
            <button className="btn-ghost h-9 w-9 !p-0 text-red-600" aria-label={`Hapus ${c.name}`} onClick={() => setDel(c)}><Trash2 size={15} /></button>
          </div>))}</div>)}
      <Modal open={edit !== null} onClose={() => setEdit(null)} title={edit?.isNew ? 'Tambah kategori' : 'Ubah kategori'}>
        {edit && (
          <form onSubmit={save} noValidate className="space-y-3">
            <Field label="Nama kategori" name="name" value={edit.c.name} onChange={(e) => setEdit({ ...edit, c: { ...edit.c, name: e.target.value } })} error={err.name} />
            <TextArea name="desc" label="Deskripsi" value={edit.c.description} onChange={(v) => setEdit({ ...edit, c: { ...edit.c, description: v } })} />
            <button className="btn-primary w-full">Simpan</button>
          </form>)}
      </Modal>
      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} danger title="Hapus kategori?" confirmLabel="Hapus"
        message={`Kategori “${del?.name ?? ''}” akan dihapus.`} onConfirm={() => del && remove(del)} />
    </div>
  )
}
