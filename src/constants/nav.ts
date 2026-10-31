import {
  BarChart3, BookOpen, ClipboardList, CreditCard, Crown, Database, History,
  LayoutDashboard, Settings, Tags, Trophy, Users, LineChart,
} from 'lucide-react'
import type { NavItem } from '@/types'

export const publicNav = [
  { label: 'Fitur', to: '/features' },
  { label: 'Materi', to: '/courses' },
  { label: 'Ujian', to: '/exams' },
  { label: 'Harga', to: '/pricing' },
  { label: 'FAQ', to: '/faq' },
]

export const studentNav: NavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Materi Belajar', to: '/dashboard/courses', icon: BookOpen },
  { label: 'Paket Ujian', to: '/dashboard/exams', icon: ClipboardList },
  { label: 'Hasil Belajar', to: '/dashboard/results', icon: Trophy },
  { label: 'Statistik Belajar', to: '/dashboard/stats', icon: BarChart3 },
  { label: 'Riwayat Aktivitas', to: '/dashboard/activity', icon: History },
  { label: 'Pengaturan', to: '/dashboard/settings', icon: Settings },
  { label: 'Upgrade Premium', to: '/dashboard/upgrade', icon: Crown },
]

export const adminNav: NavItem[] = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Manajemen Pengguna', to: '/admin/users', icon: Users },
  { label: 'Manajemen Materi', to: '/admin/courses', icon: BookOpen },
  { label: 'Kategori Materi', to: '/admin/categories', icon: Tags },
  { label: 'Paket Ujian', to: '/admin/exams', icon: ClipboardList },
  { label: 'Bank Soal', to: '/admin/questions', icon: Database },
  { label: 'Transaksi', to: '/admin/transactions', icon: CreditCard },
  { label: 'Laporan & Analitik', to: '/admin/reports', icon: LineChart },
  { label: 'Pengaturan Sistem', to: '/admin/settings', icon: Settings },
]
