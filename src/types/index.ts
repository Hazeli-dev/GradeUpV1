import type { LucideIcon } from 'lucide-react'

export type UserRole = 'student' | 'admin'
export type Level = 'SD' | 'SMP' | 'SMA' | 'Umum'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}
