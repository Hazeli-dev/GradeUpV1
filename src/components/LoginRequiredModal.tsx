import { Link } from 'react-router-dom'
import Modal from '@/components/Modal'

export default function LoginRequiredModal({ open, onClose, action }: { open: boolean; onClose: () => void; action: string }) {
  return (
    <Modal open={open} onClose={onClose} title="Masuk untuk melanjutkan">
      <p className="text-sm text-muted">Kamu perlu akun GradeUp untuk {action}. Daftar gratis, tidak perlu kartu kredit.</p>
      <div className="mt-5 flex gap-2">
        <Link to="/login" className="btn-ghost flex-1 border border-border">Masuk</Link>
        <Link to="/register" className="btn-primary flex-1">Daftar Gratis</Link>
      </div>
    </Modal>
  )
}
