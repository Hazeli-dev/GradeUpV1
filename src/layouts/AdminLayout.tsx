import DashboardShell from '@/components/DashboardShell'
import { adminNav } from '@/constants/nav'

// DEMO: belum ada proteksi peran. Jangan anggap /admin aman sebelum Supabase Auth + RLS dipasang.
export default function AdminLayout() {
  return <DashboardShell items={adminNav} areaLabel="Panel Admin" homePath="/admin" userName="Admin GradeUp" />
}
