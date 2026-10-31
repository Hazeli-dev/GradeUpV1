import DashboardShell from '@/components/DashboardShell'
import { studentNav } from '@/constants/nav'
import { useAuth } from '@/context/AuthContext'

export default function StudentLayout() {
  const { userName } = useAuth()

  return (
    <DashboardShell 
      items={studentNav} 
      areaLabel="Dashboard Siswa" 
      homePath="/dashboard" 
      userName={userName} 
    />
  )
}
