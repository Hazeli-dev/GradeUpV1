import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Star } from 'lucide-react'
import { categories, levels } from '@/data/demo'
import { coursesStore, type AdminCourse } from '@/data/admin'
import { useStore } from '@/lib/store'
import { CourseCard } from '@/components/CatalogCards'

type StudentCourse = AdminCourse & { grade?: string; premium?: boolean }

export default function Courses() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [lvl, setLvl] = useState('')
  const [grd, setGrd] = useState('')

  // State untuk Modal Baca Teks
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null)

  // Ambil data live dari coursesStore
  const allCourses = useStore(coursesStore) as StudentCourse[]

  // Mengambil daftar Kelas yang tersedia secara dinamis dari data materi
  const availableGrades = useMemo(() => {
    const gradesSet = new Set<string>()
    allCourses.forEach((c) => {
      if (c.grade) gradesSet.add(c.grade)
    })
    return Array.from(gradesSet).sort()
  }, [allCourses])

  // Filtering: Hanya materi berstatus "Terbit" dan sesuai filter pencarian/kategori/jenjang/kelas
  const list = useMemo(
    () =>
      allCourses.filter(
        (c) =>
          c.status === 'Terbit' &&
          c.title.toLowerCase().includes(q.trim().toLowerCase()) &&
          (!cat || c.category === cat) &&
          (!lvl || c.level === lvl) &&
          (!grd || c.grade === grd)
      ),
    [allCourses, q, cat, lvl, grd]
  )

  // Handler klik tombol pada kartu materi
  const handleAction = (c: StudentCourse) => {
    if (c.contentType === 'file') {
      if (c.fileUrl) {
        window.open(c.fileUrl, '_blank')
      } else {
        alert('File materi belum tersedia atau belum di-upload.')
      }
    } else if (c.content) {
      setSelectedCourse(c)
    } else {
      nav(`/dashboard/courses/${c.id}`)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Materi Belajar</h1>

      {/* Filter Control (Diperluas dengan Tambahan Filter Kelas) */}
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_140px_130px]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Cari materi..."
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
        <select
          className="input"
          value={grd}
          onChange={(e) => setGrd(e.target.value)}
          aria-label="Kelas"
        >
          <option value="">Semua Kelas</option>
          {availableGrades.map((g) => (
            <option key={g} value={g}>
              Kelas {g}
            </option>
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
              course={c as any}
              onAction={() => handleAction(c)}
            />
          ))}
        </div>
      )}

      {/* MODAL BACA TEKS MANUAL (Mendukung Dark Mode) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="card flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden border border-border bg-card shadow-2xl">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                  <span>{selectedCourse.category}</span>
                  <span>·</span>
                  <span>{selectedCourse.level}</span>
                  {selectedCourse.grade && <span>(Kelas {selectedCourse.grade})</span>}
                  {selectedCourse.premium && (
                    <span className="flex items-center gap-1 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
                      <Star size={10} className="fill-amber-950" /> PREMIUM
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-foreground">{selectedCourse.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="btn-ghost h-8 w-8 !p-0 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {selectedCourse.content}
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end border-t border-border p-4">
              <button
                className="btn-ghost border border-border"
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
