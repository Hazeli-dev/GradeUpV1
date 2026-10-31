export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export function passwordError(v: string): string {
  if (v.length < 8) return 'Minimal 8 karakter'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Gunakan kombinasi huruf dan angka'
  return ''
}
