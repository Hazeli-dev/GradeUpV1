import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const KEY = 'gradeup-theme'
const EVT = 'gradeup-theme-change'

function initial(): Theme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* storage tidak tersedia */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem(KEY, theme) } catch { /* abaikan */ }
    window.dispatchEvent(new CustomEvent(EVT, { detail: theme }))
  }, [theme])

  // Sinkronkan beberapa pemakai hook (tombol header dan halaman pengaturan)
  useEffect(() => {
    const h = (e: Event) => setTheme((e as CustomEvent<Theme>).detail)
    window.addEventListener(EVT, h)
    return () => window.removeEventListener(EVT, h)
  }, [])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, setTheme, toggle }
}
