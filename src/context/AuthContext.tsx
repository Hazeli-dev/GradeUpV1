import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  userName: string
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userName: 'Pengguna',
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }) ?? { data: { subscription: null } }

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Mengambil Nama Lengkap dari user_metadata Supabase Auth
  const metaName = user?.user_metadata?.full_name || user?.user_metadata?.name
  const userName = metaName || user?.email?.split('@')[0] || 'Pengguna'

  return (
    <AuthContext.Provider value={{ user, userName, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
