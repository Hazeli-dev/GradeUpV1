import { useMemo, useState, type FormEvent } from 'react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { bankStore, type BankQuestion } from '@/data/admin'
import { uid, useStore } from '@/lib/store'
import ConfirmDialog from '@/components/ConfirmDialog'
import Field from '@/components/Field'
import Modal from '@/components/Modal'
import SearchBox from '@/components/SearchBox'
import { SelectField, TextArea } from '@/components/SelectField'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/utils'

const subjects = ['Matematika', 'IPA', 'Bahasa Indonesia', 'IPS']
const diffs = ['Mudah', 'Sedang', 'Sulit']

export default function Questions() {
  const toast = useToast(); const bank = useStore(bankStore)
  const [q, setQ] = useState(''); const [subj, setSubj] = useState(''); const [diff, setDiff] = useState('')
  const [edit, setEdit] = useState<{ b: BankQuestion; isNew: boolean } | null>(null); const [err, setErr] = useState<Record<string, string>>({}); const [del, setDel] = useState<BankQuestion | null>(null)
  const list = useMemo(() => bank.filter((b) => b.text.toLowerCase().includes(q.trim().toLowerCase()) && (!subj || b.subject === subj) && (!diff || b.difficulty === diff)), [bank, q, subj, diff])
  const set = (p: Partial<BankQuestion>) => edit && setEdit({ ...edit, b: { ...edit.b, ...p } })

  function save(e: FormEvent) {
    e.preventDefault()
    if (!edit) return
    const er: Record<string, string> = {}
    if (edit.b.text.trim().length < 10) er.text = 'Soal minimal 10 karakter'
    if (edit.b.options.some((o) => !o.trim())) er.options = 'Semua pilihan jawaban wajib diisi'
    else if (new Set(edit.b.options.map((o) => o.trim().toLowerCase())).size < 4) er.options = 'Pilihan jawaban tidak boleh sama'
    if (edit.b.explanation.trim().length < 5) er.explanation = 'Tulis pembahasan singkat'
    setErr(er)
    if (Object.keys(er).length) return
    bankStore.set(edit.isNew ? [edit.b, ...bank] : bank.map((x) => (x.id === edit.b.id ? edit.b : x)))
    toast(edit.isNew ? 'Soal ditambahkan' : 'Soal diperbarui'); setEdit(null)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-extrabold tracking-tight">Bank Soal</h1>
        <button className="btn-primary" onClick={() => { setErr({}); setEdit({ isNew: true, b: { id: uid(), subject: subjects[0], difficulty: 'Sedang', text: '', options: ['', '', '', ''], correct: 0, explanation: '' } }) }}>Tambah soal</button></div>
      <div className="grid gap-3 sm:grid-cols-[1fr_190px_150px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari teks soal" />
        <select className="input" value={subj} onChange={(e) => setSubj(e.target.value)} aria-label="Mata pelajaran"><option value="">Semua mapel</option>{subjects.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="input" value={diff} onChange={(e) => setDiff(e.target.value)} aria-label="Kesulitan"><option value="">Semua tingkat</option>{diffs.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {list.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Tidak ada soal yang cocok.</p> : list.map((b) => (
        <article key={b.id} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-semibold text-primary">{b.subject} · {b.difficulty}</p><h3 className="mt-1 font-bold leading-snug">{b.text}</h3></div>
            <div className="flex shrink-0 gap-1">
              <button className="btn-ghost h-9 w-9 !p-0" aria-label="Ubah soal" onClick={() => { setErr({}); setEdit({ isNew: false, b }) }}><Pencil size={15} /></button>
              <button className="btn-ghost h-9 w-9 !p-0 text-red-600" aria-label="Hapus soal" onClick={() => setDel(b)}><Trash2 size={15} /></button></div>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">{b.options.map((o, i) => (
            <li key={o + i} className={cn('flex items-center gap-2 rounded-xl border px-3 py-2 text-sm', i === b.correct ? 'border-secondary bg-secondary/10 font-semibold' : 'border-border')}>
              <span className="text-xs text-muted">{'ABCD'[i]}</span>{o}{i === b.correct && <Check size={14} className="ml-auto text-secondary" aria-label="Jawaban benar" />}</li>))}</ul>
          <p className="mt-3 rounded-lg bg-soft/50 p-3 text-sm text-muted">{b.explanation}</p>
        </article>))}
      <Modal open={edit !== null} onClose={() => setEdit(null)} title={edit?.isNew ? 'Tambah soal' : 'Ubah soal'}>
        {edit && (
          <form onSubmit={save} noValidate className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <SelectField name="subject" label="Mata pelajaran" value={edit.b.subject} options={subjects} onChange={(v) => set({ subject: v })} />
              <SelectField name="difficulty" label="Kesulitan" value={edit.b.difficulty} options={diffs} onChange={(v) => set({ difficulty: v as BankQuestion['difficulty'] })} />
            </div>
            <TextArea name="text" label="Teks soal" value={edit.b.text} onChange={(v) => set({ text: v })} error={err.text} />
            {edit.b.options.map((o, i) => <Field key={i} label={`Pilihan ${'ABCD'[i]}`} name={`opt${i}`} value={o} onChange={(e) => set({ options: edit.b.options.map((x, k) => (k === i ? e.target.value : x)) })} />)}
            {err.options && <p className="text-xs text-red-500">{err.options}</p>}
            <SelectField name="correct" label="Jawaban benar" value={'ABCD'[edit.b.correct]} options={['A', 'B', 'C', 'D']} onChange={(v) => set({ correct: 'ABCD'.indexOf(v) })} />
            <TextArea name="explanation" label="Pembahasan" value={edit.b.explanation} onChange={(v) => set({ explanation: v })} error={err.explanation} />
            <button className="btn-primary w-full">Simpan</button>
          </form>)}
      </Modal>
      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} danger title="Hapus soal?" confirmLabel="Hapus"
        message="Soal akan dihapus dari bank soal." onConfirm={() => { if (del) { bankStore.set(bank.filter((x) => x.id !== del.id)); toast('Soal dihapus') } }} />
    </div>
  )
}
