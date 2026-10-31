import Modal from '@/components/Modal'
import PlanChooser from '@/components/PlanChooser'
import { useToast } from '@/components/Toast'

export default function PremiumUpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast()
  return (
    <Modal open={open} onClose={onClose} title="Upgrade ke Premium">
      <PlanChooser onConfirm={() => { toast('Pembayaran belum tersedia. Fitur ini disiapkan untuk fase berikutnya.', 'info'); onClose() }} />
    </Modal>
  )
}
