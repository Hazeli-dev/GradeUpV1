import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, Download, Eye, X } from 'lucide-react'
import { categories, levels } from '@/data/demo'
import { coursesStore, type AdminCourse } from '@/data/admin'
import { useStore } from '@/lib/store'
import { CourseCard } from '@/components/CatalogCards'

export default function Courses() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [lvl, setLvl] = useState('')

  // State untuk Modal Baca Teks
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null)

  // Ambil data live dari coursesStore
  const allCourses = useStore(coursesStore)

  // Filtering: Hanya materi berstatus "Terbit" dan sesuai filter pencarian
  const list = useMemo(
    () =>
      allCourses.filter(
        (c) =>
          c.status === 'Terbit' &&
          c.title.toLowerCase().includes(q.trim().toLowerCase()) &&
          (!cat || c.category === cat) &&
          (!lvl || c.level === lvl)
      ),
    [allCourses, q, cat, lvl]
  )

  // Handler klik tombol pada kartu materi
  const handleAction = (c: AdminCourse) => {
    if (c.contentType === 'file') {
      if (c.fileUrl) {
        window.open(c.fileUrl, '_blank')
      } else {
        alert('File materi belum tersedia atau belum di-upload.')
      }
    } else if (c.content) {
      setSelectedCourse(c)
    } else {
      // Jika tidak ada isi khusus, navigasi ke rincian detail bawaan
      nav(`/dashboard/courses/${c.id}`)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Materi Belajar</h1>

      {/* Filter Control */}
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_160px]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Cari materi"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari materi"
          />
        </div>
        <select
          className="input"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label="Kategori"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          className="input"
          value={lvl}
          onChange={(e) => setLvl(e.target.value)}
          aria-label="Jenjang"
        >
          <option value="">Semua jenjang</option>
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Course Cards List */}
      {list.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">
          Tidak ada materi yang cocok dengan filter ini.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onAction={() => handleAction(c)}
            />
          ))}
        </div>
      )}

      {/* MODAL BACA TEKS MANUL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="card flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-xl">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600">
                  {selectedCourse.category} · {selectedCourse.level}
                </span>
                <h2 className="text-lg font-bold text-slate-800">{selectedCourse.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {selectedCourse.content}
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end border-t border-slate-100 p-4">
              <button
                className="btn-ghost border border-slate-200"
                onClick={() => setSelectedCourse(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
