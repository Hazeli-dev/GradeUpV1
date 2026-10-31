import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className="btn-ghost h-10 w-10 !p-0" aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
