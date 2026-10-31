import { BarChart3, BookOpen, ClipboardCheck, Flame, ShieldCheck, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Level } from '@/types'

export const levels: Level[] = ['SD', 'SMP', 'SMA', 'Umum']
export const categories = ['Matematika', 'IPA', 'Bahasa', 'IPS', 'Persiapan Ujian']

export interface Course { id: string; title: string; category: string; level: Level; lessons: number; hours: number; rating: number }
export const courses: Course[] = [
  { id: 'c1', title: 'Aljabar Dasar dan Persamaan Linear', category: 'Matematika', level: 'SMP', lessons: 24, hours: 6, rating: 4.8 },
  { id: 'c2', title: 'Fisika: Gerak dan Gaya', category: 'IPA', level: 'SMA', lessons: 30, hours: 9, rating: 4.7 },
  { id: 'c3', title: 'Bahasa Indonesia: Teks Eksposisi', category: 'Bahasa', level: 'SMP', lessons: 16, hours: 4, rating: 4.6 },
  { id: 'c4', title: 'Berhitung Seru: Perkalian dan Pembagian', category: 'Matematika', level: 'SD', lessons: 20, hours: 5, rating: 4.9 },
  { id: 'c5', title: 'Biologi: Sistem Pencernaan Manusia', category: 'IPA', level: 'SMP', lessons: 14, hours: 3, rating: 4.5 },
  { id: 'c6', title: 'Sejarah Indonesia: Masa Pergerakan Nasional', category: 'IPS', level: 'SMA', lessons: 18, hours: 5, rating: 4.6 },
  { id: 'c7', title: 'Strategi Lolos UTBK: Penalaran Umum', category: 'Persiapan Ujian', level: 'SMA', lessons: 36, hours: 12, rating: 4.8 },
  { id: 'c8', title: 'English for Daily Communication', category: 'Bahasa', level: 'Umum', lessons: 22, hours: 7, rating: 4.7 },
]

export interface Exam { id: string; title: string; level: Level; questions: number; minutes: number; difficulty: 'Mudah' | 'Sedang' | 'Sulit'; premium: boolean }
export const exams: Exam[] = [
  { id: 'e1', title: 'Try Out Matematika SMP Semester 1', level: 'SMP', questions: 40, minutes: 60, difficulty: 'Sedang', premium: false },
  { id: 'e2', title: 'Simulasi UTBK: Penalaran Umum', level: 'SMA', questions: 30, minutes: 45, difficulty: 'Sulit', premium: true },
  { id: 'e3', title: 'Latihan Soal IPA Kelas 6', level: 'SD', questions: 25, minutes: 40, difficulty: 'Mudah', premium: false },
  { id: 'e4', title: 'Try Out Fisika SMA: Dinamika', level: 'SMA', questions: 35, minutes: 60, difficulty: 'Sulit', premium: true },
  { id: 'e5', title: 'Bahasa Inggris: Reading Comprehension', level: 'Umum', questions: 20, minutes: 30, difficulty: 'Sedang', premium: false },
  { id: 'e6', title: 'Ujian Akhir Bahasa Indonesia SMP', level: 'SMP', questions: 40, minutes: 75, difficulty: 'Sedang', premium: true },
]

export const features: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: 'Materi Terstruktur', desc: 'Pelajaran per jenjang dan topik, disusun dari dasar hingga mahir.', icon: BookOpen },
  { title: 'Ujian Online', desc: 'Kerjakan try out dengan timer dan navigasi soal seperti ujian sungguhan.', icon: ClipboardCheck },
  { title: 'Pembahasan Lengkap', desc: 'Setiap soal punya penjelasan langkah demi langkah.', icon: ShieldCheck },
  { title: 'Statistik Belajar', desc: 'Lihat perkembangan nilai dan mata pelajaran yang perlu dilatih lagi.', icon: BarChart3 },
  { title: 'Streak Harian', desc: 'Jaga kebiasaan belajar dengan penanda hari berturut-turut.', icon: Flame },
  { title: 'Latihan Terjadwal', desc: 'Atur durasi latihan sesuai waktu luangmu.', icon: Timer },
]

export interface Plan { id: string; name: string; price: string; period: string; popular?: boolean; perks: string[] }
export const plans: Plan[] = [
  { id: 'free', name: 'Gratis', price: 'Rp0', period: 'selamanya', perks: ['Materi dasar', '3 paket ujian gratis', 'Statistik ringkas'] },
  { id: 'monthly', name: 'Premium Bulanan', price: 'Rp49.000', period: 'per bulan', popular: true, perks: ['Semua materi', 'Semua paket ujian', 'Pembahasan lengkap', 'Statistik mendalam'] },
  { id: 'yearly', name: 'Premium Tahunan', price: 'Rp399.000', period: 'per tahun', perks: ['Semua fitur Premium Bulanan', 'Hemat sekitar 32%', 'Akses lebih awal ke fitur baru'] },
]

export const comparison: { feature: string; values: (string | boolean)[] }[] = [
  { feature: 'Materi belajar', values: ['Dasar', 'Semua', 'Semua'] },
  { feature: 'Paket ujian', values: ['3 paket', 'Semua', 'Semua'] },
  { feature: 'Pembahasan soal', values: [false, true, true] },
  { feature: 'Statistik mendalam', values: [false, true, true] },
  { feature: 'Akses fitur baru lebih awal', values: [false, false, true] },
]

export const faqs = [
  { q: 'Apakah GradeUp benar-benar gratis?', a: 'Paket Gratis bisa dipakai tanpa batas waktu dengan materi dasar dan beberapa paket ujian. Fitur lengkap tersedia di paket Premium.' },
  { q: 'Jenjang apa saja yang tersedia?', a: 'SD, SMP, SMA, dan kelas umum seperti bahasa dan persiapan ujian masuk.' },
  { q: 'Bagaimana cara kerja ujian online?', a: 'Pilih paket ujian, baca petunjuk, lalu kerjakan dengan timer. Nilai dan pembahasan tersedia setelah kamu mengumpulkan jawaban.' },
  { q: 'Bisakah saya berhenti berlangganan?', a: 'Bisa. Kamu dapat berhenti kapan saja dan tetap memakai paket Gratis.' },
  { q: 'Apakah data belajar saya aman?', a: 'Keamanan akun dan penyimpanan data akan memakai autentikasi dan database nyata saat platform diluncurkan. Versi saat ini masih demo.' },
  { q: 'Bagaimana menghubungi tim GradeUp?', a: 'Gunakan formulir di halaman Kontak.' },
]

export const testimonials = [
  { name: 'Alya Putri', role: 'Siswa kelas 9', text: 'Nilai try out matematika saya naik dari 62 ke 81 dalam dua bulan karena rutin latihan dan membaca pembahasan.' },
  { name: 'Bima Pratama', role: 'Siswa kelas 12', text: 'Simulasi UTBK-nya terasa seperti ujian sungguhan. Statistiknya membantu saya tahu bab mana yang harus diulang.' },
  { name: 'Ibu Sari', role: 'Orang tua siswa SD', text: 'Anak saya jadi mau belajar sendiri setiap sore. Streak hariannya jadi semacam tantangan kecil buat dia.' },
]
