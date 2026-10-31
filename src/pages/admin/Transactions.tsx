import { useMemo, useState } from 'react'
import { trxStore, type Trx } from '@/data/admin'
import { useStore } from '@/lib/store'
import Modal from '@/components/Modal'
import SearchBox from '@/components/SearchBox'
import StatusBadge from '@/components/StatusBadge'
import { fmtDate, rupiah } from '@/utils/format'

export default function Transactions() {
  const trx = useStore(trxStore)
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [sel, setSel] = useState<Trx | null>(null)
  const list = useMemo(() => trx.filter((t) => (t.id + t.user).toLowerCase().includes(q.trim().toLowerCase()) && (!status || t.status === status)), [trx, q, status])
  const rows: [string, string][] = sel ? [['ID transaksi', sel.id], ['Pengguna', sel.user], ['Paket', sel.plan], ['Jumlah', rupiah(sel.amount)], ['Metode', sel.method], ['Tanggal', fmtDate(sel.date)]] : []
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Transaksi</h1>
      <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari ID atau nama pengguna" />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status pembayaran"><option value="">Semua status</option><option>Berhasil</option><option>Menunggu</option><option>Gagal</option></select>
      </div>
      {list.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Tidak ada transaksi yang cocok.</p> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b border-border text-muted"><th className="p-4">ID</th><th className="p-4">Pengguna</th><th className="p-4">Paket</th><th className="p-4">Jumlah</th><th className="p-4">Status</th><th className="p-4">Tanggal</th><th className="p-4" /></tr></thead>
          <tbody>{list.map((t) => (
            <tr key={t.id} className="border-b border-border last:border-0">
              <td className="p-4 font-medium">{t.id}</td><td className="p-4">{t.user}</td><td className="p-4">{t.plan}</td><td className="p-4">{rupiah(t.amount)}</td>
              <td className="p-4"><StatusBadge label={t.status} /></td><td className="p-4 text-muted">{fmtDate(t.date)}</td>
              <td className="p-4 text-right"><button className="font-semibold text-primary" onClick={() => setSel(t)}>Detail</button></td>
            </tr>))}</tbody></table></div>)}
      <p className="text-xs text-muted">Data contoh (demo). Integrasi payment gateway belum tersedia.</p>
      <Modal open={sel !== null} onClose={() => setSel(null)} title="Detail transaksi">
        <dl className="space-y-2 text-sm">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}
          {sel && <div className="flex justify-between"><dt className="text-muted">Status</dt><dd><StatusBadge label={sel.status} /></dd></div>}</dl>
      </Modal>
    </div>
  )
}
