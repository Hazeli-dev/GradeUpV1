import Modal from '@/components/Modal'

interface Props { open: boolean; title: string; message: string; confirmLabel: string; onConfirm: () => void; onClose: () => void; danger?: boolean }

export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose, danger }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-5 flex gap-2">
        <button className="btn-ghost flex-1 border border-border" onClick={onClose}>Batal</button>
        <button className={danger ? 'btn flex-1 bg-red-600 text-white hover:bg-red-700' : 'btn-primary flex-1'} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}
