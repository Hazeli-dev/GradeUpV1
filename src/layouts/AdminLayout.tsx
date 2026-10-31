import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardShell from '@/components/DashboardShell'
import { adminNav } from '@/constants/nav'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function AdminLayout() {
  const { user, userName, loading } = useAuth()
  const nav = useNavigate()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    async function verifyAdminRole() {
      // 1. Tunggu AuthContext selesai mengambil data user
      if (loading) return

      // 2. Jika user belum login, lemparkan ke halaman login
      if (!user) {
        nav('/login', { replace: true })
        return
      }

      // 3. Periksa kolom role di tabel profiles Supabase
      if (supabase) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin') {
          setIsAdmin(true)
        } else {
          // Jika role bukan admin (misal 'student'), kembalikan ke dashboard siswa
          nav('/dashboard', { replace: true })
        }
      } else {
        setIsAdmin(true)
      }
    }

    verifyAdminRole()
  }, [user, loading, nav])

  // Tampilkan UI loading saat proses pengecekan hak akses berjalan
  if (loading || isAdmin === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-sm text-muted">
        Memeriksa hak akses admin...
      </div>
    )
  }

  return (
    <DashboardShell
      items={adminNav}
      areaLabel="Panel Admin"
      homePath="/admin"
      userName={userName}
    />
  )
}
