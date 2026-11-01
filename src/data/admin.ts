// DEMO: semua data admin hanya contoh dan disimpan di memori.
import { courses as baseCourses, categories as baseCats, exams as baseExams } from '@/data/demo'
import { questions as baseQs } from '@/data/student'
import { createStore } from '@/lib/store'
import type { Level } from '@/types'

export interface AdminUser { id: string; name: string; email: string; level: Level; plan: 'Gratis' | 'Premium'; status: 'Aktif' | 'Ditangguhkan'; joined: string }

// AdminCourse dengan contentType opsional (?) agar tidak error TS2741
export interface AdminCourse { 
  id: string; 
  title: string; 
  category: string; 
  level: Level; 
  lessons: number; 
  status: 'Terbit' | 'Draf';
  contentType?: 'text' | 'file';
  content?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface Category { id: string; name: string; description: string }
export interface AdminExam { id: string; title: string; level: Level; questions: number; minutes: number; premium: boolean; status: 'Terbit' | 'Draf' }
export interface BankQuestion { id: string; subject: string; difficulty: 'Mudah' | 'Sedang' | 'Sulit'; text: string; options: string[]; correct: number; explanation: string }
export interface Trx { id: string; user: string; plan: string; amount: number; method: string; status: 'Berhasil' | 'Menunggu' | 'Gagal'; date: string }

const names = ['Alya Putri', 'Bima Pratama', 'Citra Lestari', 'Dimas Saputra', 'Eka Wulandari', 'Fajar Nugroho', 'Gita Maharani', 'Hendra Wijaya', 'Intan Permata', 'Joko Santoso', 'Kirana Dewi', 'Lukman Hakim']
const lv: Level[] = ['SMP', 'SMA', 'SD', 'SMA', 'SMP', 'Umum']
export const usersStore = createStore<AdminUser>(names.map((n, i) => ({
  id: `u${i + 1}`, name: n, email: `${n.split(' ')[0].toLowerCase()}@example.com`, level: lv[i % 6],
  plan: i % 3 === 1 ? 'Premium' : 'Gratis', status: i === 7 ? 'Ditangguhkan' : 'Aktif',
  joined: `2026-${i < 4 ? '10' : i < 8 ? '09' : '08'}-${String(28 - i * 2).padStart(2, '0')}`,
})))

export const categoriesStore = createStore<Category>(baseCats.map((c, i) => ({ id: `k${i + 1}`, name: c, description: `Kumpulan materi ${c.toLowerCase()} untuk berbagai jenjang.` })))

export const coursesStore = createStore<AdminCourse>(baseCourses.map((c, i) => ({ 
  id: c.id, 
  title: c.title, 
  category: c.category, 
  level: c.level, 
  lessons: c.lessons, 
  status: i === 4 || i === 7 ? 'Draf' : 'Terbit',
  contentType: 'text',
  content: `Ini adalah ringkasan bacaan untuk materi ${c.title}.`,
  fileName: '',
  fileUrl: ''
})))

export const examsStore = createStore<AdminExam>(baseExams.map((e, i) => ({ id: e.id, title: e.title, level: e.level, questions: e.questions, minutes: e.minutes, premium: e.premium, status: i === 5 ? 'Draf' : 'Terbit' })))
const diffs: BankQuestion['difficulty'][] = ['Mudah', 'Sedang', 'Mudah', 'Mudah', 'Sedang', 'Mudah', 'Sedang', 'Sedang', 'Mudah', 'Sulit']
export const bankStore = createStore<BankQuestion>(baseQs.map((q, i) => ({ id: q.id, subject: q.subject, difficulty: diffs[i], text: q.text, options: q.options, correct: q.correct, explanation: q.explanation })))

const pu = ['Bima Pratama', 'Gita Maharani', 'Dimas Saputra', 'Kirana Dewi', 'Fajar Nugroho', 'Citra Lestari', 'Hendra Wijaya', 'Alya Putri', 'Intan Permata', 'Joko Santoso']
export const trxStore = createStore<Trx>(pu.map((u, i) => {
  const yearly = i % 4 === 2
  return { id: `TRX-${1010 - i}`, user: u, plan: yearly ? 'Premium Tahunan' : 'Premium Bulanan', amount: yearly ? 399000 : 49000,
    method: ['Transfer Bank', 'E-Wallet', 'Kartu'][i % 3], status: i === 3 ? 'Menunggu' : i === 6 ? 'Gagal' : 'Berhasil', date: `2026-10-${String(30 - i * 2).padStart(2, '0')}` }
}))

export const visitors = Array.from({ length: 30 }, (_, i) => ({ hari: String(i + 1), pengunjung: Math.round(420 + Math.sin(i / 3) * 80 + i * 6) }))
const bulan = ['Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt']
const rev = [4.1, 4.6, 5.2, 5.0, 6.3, 7.1, 7.8, 8.4, 9.2, 10.1, 11.3, 12.4]
const usr = [120, 140, 170, 160, 210, 250, 270, 310, 340, 390, 430, 480]
const conv = [3.1, 3.3, 3.6, 3.5, 4.0, 4.2, 4.5, 4.7, 4.9, 5.2, 5.5, 5.8]
const exm = [900, 1050, 1300, 1250, 1600, 1900, 2100, 2400, 2650, 3000, 3350, 3800]
export const monthly = bulan.map((b, i) => ({ bulan: b, pendapatan: rev[i], pengguna: usr[i], konversi: conv[i], ujian: exm[i] }))
export const revenueByPlan = [{ name: 'Premium Bulanan', value: 58 }, { name: 'Premium Tahunan', value: 42 }]
