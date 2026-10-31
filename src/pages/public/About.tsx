import PageHeader from '@/components/PageHeader'

const blocks = [
  { t: 'Siapa kami', d: 'GradeUp adalah platform belajar berbasis ujian untuk siswa semua jenjang. Kami menggabungkan materi, latihan soal, dan ujian online dalam satu tempat.' },
  { t: 'Visi', d: 'Setiap siswa punya cara belajar yang terukur: tahu di mana posisinya, apa yang perlu dilatih, dan seberapa jauh ia sudah maju.' },
  { t: 'Misi', d: 'Menyediakan materi yang jelas, soal berkualitas dengan pembahasan, serta statistik yang mudah dipahami siswa dan orang tua.' },
]

export default function About() {
  return (
    <>
      <PageHeader title="Tentang GradeUp" subtitle="Belajar lebih terarah lewat latihan dan umpan balik yang jelas." />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3">
        {blocks.map((b) => <div key={b.t} className="card p-6"><h2 className="font-bold">{b.t}</h2><p className="mt-2 text-sm text-muted">{b.d}</p></div>)}
      </div>
    </>
  )
}
