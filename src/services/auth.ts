import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { 
      ok: false, 
      message: 'Koneksi Supabase belum diatur. Periksa file .env Anda.' 
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { ok: false, message: error.message }
    }

    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, message: err.message || 'Terjadi kesalahan sistem.' }
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'Supabase belum dikonfigurasi.' }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return { ok: false, message: error.message }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: 'student',
          },
        ])

      if (profileError) {
        console.error('Gagal membuat profil:', profileError)
      }
    }

    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, message: err.message || 'Gagal mendaftar.' }
  }
}

export async function updatePassword(newPassword: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'Supabase belum dikonfigurasi.' }
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) return { ok: false, message: error.message }
    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, message: err.message || 'Gagal memperbarui kata sandi.' }
  }
}

export async function resendVerification(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'Supabase belum dikonfigurasi.' }
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) return { ok: false, message: error.message }
    return { ok: true }
  } catch (err: any) {
    return { ok: false, message: err.message || 'Gagal mengirim ulang verifikasi.' }
  }
}

// Tambahan fungsi yang dicari oleh halaman ForgotPassword
export async function requestPasswordReset(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'Supabase belum dikonfigurasi.' }
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })

    if (error) return { ok: false, message: error.message }
    return { ok: true }
  } catch (err: any) {
    return { ok: false, message: err.message || 'Gagal mengirim permintaan reset kata sandi.' }
  }
}