import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-6xl font-extrabold text-primary">404</p>
        <p className="mt-2 text-muted">Halaman yang Anda cari tidak ditemukan.</p>
        <Link to="/" className="btn-primary mt-5">Kembali ke beranda</Link>
      </div>
    </div>
  )
}
