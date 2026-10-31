import { faqs } from '@/data/demo'
import FaqList from '@/components/Faq'
import PageHeader from '@/components/PageHeader'

export default function Faq() {
  return (
    <>
      <PageHeader title="FAQ" subtitle="Jawaban untuk pertanyaan yang paling sering diajukan." />
      <div className="mx-auto max-w-3xl px-4 py-12"><FaqList items={faqs} /></div>
    </>
  )
}
