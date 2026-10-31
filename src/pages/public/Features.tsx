import { features } from '@/data/demo'
import PageHeader from '@/components/PageHeader'

export default function Features() {
  return (
    <>
      <PageHeader title="Fitur" subtitle="Dari materi sampai statistik, semuanya dirancang untuk membuat belajarmu konsisten." />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-2">
        {features.map(({ title, desc, icon: Icon }) => (
          <div key={title} className="card flex gap-4 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-soft text-primary"><Icon size={22} /></span>
            <div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm text-muted">{desc}</p></div>
          </div>
        ))}
      </div>
    </>
  )
}
