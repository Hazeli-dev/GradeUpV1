import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

// Null sampai env diisi. Autentikasi & database nyata dikerjakan di fase berikutnya.
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null
