import { supabase } from '@/lib/supabase'

export interface AuthResult { ok: boolean; demo?: boolean; message?: string }
type Call = () => PromiseLike<{ error: { message: string } | null }>

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Tanpa env Supabase, semua panggilan hanya simulasi (DEMO) dan TIDAK mengamankan apa pun.
async function run(real: Call): Promise<AuthResult> {
  if (!supabase) { await wait(700); return { ok: true, demo: true } }
  const { error } = await real()
  return error ? { ok: false, message: error.message } : { ok: true }
}

const origin = () => window.location.origin

export const signIn = (email: string, password: string) =>
  run(() => supabase!.auth.signInWithPassword({ email, password }))
export const signUp = (name: string, email: string, password: string) =>
  run(() => supabase!.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${origin()}/verify-email` } }))
export const requestPasswordReset = (email: string) =>
  run(() => supabase!.auth.resetPasswordForEmail(email, { redirectTo: `${origin()}/reset-password` }))
export const updatePassword = (password: string) => run(() => supabase!.auth.updateUser({ password }))
export const resendVerification = (email: string) => run(() => supabase!.auth.resend({ type: 'signup', email }))
