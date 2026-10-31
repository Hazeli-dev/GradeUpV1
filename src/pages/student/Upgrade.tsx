import PlanChooser from '@/components/PlanChooser'
import { useToast } from '@/components/Toast'

export default function Upgrade() {
  const toast = useToast()
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Upgrade Premium</h1><p className="mt-1 text-sm text-muted">Buka semua materi, paket ujian, dan pembahasan.</p></div>
      <div className="card p-6">
        <PlanChooser onConfirm={() => toast('Pembayaran belum tersedia. Fitur ini disiapkan untuk fase berikutnya.', 'info')} />
      </div>
    </div>
  )
}
