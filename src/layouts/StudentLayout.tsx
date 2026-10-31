import DashboardShell from '@/components/DashboardShell'
import { studentNav } from '@/constants/nav'

// Data pengguna di bawah ini hanya DEMO. Akses berbasis peran menyusul bersama Supabase Auth.
export default function StudentLayout() {
  return <DashboardShell items={studentNav} areaLabel="Dashboard Siswa" homePath="/dashboard" userName="Alya Putri" />
}
