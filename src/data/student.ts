// DEMO: semua data siswa di file ini hanya contoh. Hasil ujian baru hanya tersimpan di memori (hilang saat halaman dimuat ulang).
export const student = { name: 'Alya Putri', email: 'alya.putri@example.com', level: 'SMP', plan: 'Gratis', isPremium: false }

export interface Question { id: string; subject: string; text: string; options: string[]; correct: number; explanation: string }
export const questions: Question[] = [
  { id: 'q1', subject: 'Matematika', text: 'Jika 3x + 5 = 20, nilai x adalah…', options: ['3', '5', '15', '25'], correct: 1, explanation: '3x = 20 − 5 = 15, sehingga x = 15 ÷ 3 = 5.' },
  { id: 'q2', subject: 'Matematika', text: 'Luas persegi panjang berukuran 12 cm × 5 cm adalah…', options: ['17 cm²', '34 cm²', '60 cm²', '120 cm²'], correct: 2, explanation: 'Luas = panjang × lebar = 12 × 5 = 60 cm².' },
  { id: 'q3', subject: 'Matematika', text: 'Hasil dari 2⁵ adalah…', options: ['10', '16', '25', '32'], correct: 3, explanation: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32.' },
  { id: 'q4', subject: 'IPA', text: 'Planet yang paling dekat dengan Matahari adalah…', options: ['Venus', 'Merkurius', 'Bumi', 'Mars'], correct: 1, explanation: 'Urutan dari Matahari: Merkurius, Venus, Bumi, Mars.' },
  { id: 'q5', subject: 'IPA', text: 'Gaya yang menarik benda ke arah pusat Bumi disebut…', options: ['Gaya gesek', 'Gaya magnet', 'Gaya gravitasi', 'Gaya pegas'], correct: 2, explanation: 'Gaya gravitasi menarik benda bermassa ke pusat Bumi.' },
  { id: 'q6', subject: 'IPA', text: 'Organ yang memompa darah ke seluruh tubuh adalah…', options: ['Paru-paru', 'Jantung', 'Hati', 'Ginjal'], correct: 1, explanation: 'Jantung memompa darah melalui pembuluh darah ke seluruh tubuh.' },
  { id: 'q7', subject: 'Bahasa Indonesia', text: 'Sinonim kata “rajin” adalah…', options: ['Malas', 'Tekun', 'Lambat', 'Ceroboh'], correct: 1, explanation: '“Tekun” bermakna sama dengan rajin; pilihan lain berlawanan atau tidak terkait.' },
  { id: 'q8', subject: 'Bahasa Indonesia', text: 'Ide pokok paragraf umumnya terdapat pada…', options: ['Kalimat utama', 'Kalimat penjelas', 'Judul bab', 'Nomor halaman'], correct: 0, explanation: 'Kalimat utama memuat gagasan pokok; kalimat penjelas mengembangkannya.' },
  { id: 'q9', subject: 'IPS', text: 'Proklamasi kemerdekaan Indonesia dibacakan pada…', options: ['17 Agustus 1945', '1 Juni 1945', '28 Oktober 1928', '10 November 1945'], correct: 0, explanation: 'Proklamasi dibacakan pada 17 Agustus 1945 di Jakarta.' },
  { id: 'q10', subject: 'Matematika', text: 'Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah…', options: ['16 cm²', '30 cm²', '60 cm²', '120 cm²'], correct: 1, explanation: 'Luas = ½ × alas × tinggi = ½ × 10 × 6 = 30 cm².' },
]

export interface Result { id: string; examId: string; title: string; date: string; answers: (number | null)[]; minutes: number }
export function scoreOf(answers: (number | null)[]) {
  const total = questions.length
  const correct = questions.filter((q, i) => answers[i] === q.correct).length
  return { correct, total, score: Math.round((correct / total) * 100) }
}
const seed = (shift: number, k: number) => questions.map((q, i) => ((i * 3 + shift) % 10 < k ? q.correct : (q.correct + 1) % 4))

export const results: Result[] = [
  { id: 'r1', examId: 'e1', title: 'Try Out Matematika SMP Semester 1', date: '2026-10-28', answers: seed(1, 7), minutes: 48 },
  { id: 'r2', examId: 'e3', title: 'Latihan Soal IPA Kelas 6', date: '2026-10-24', answers: seed(2, 9), minutes: 31 },
  { id: 'r3', examId: 'e5', title: 'Bahasa Inggris: Reading Comprehension', date: '2026-10-19', answers: seed(4, 6), minutes: 27 },
  { id: 'r4', examId: 'e1', title: 'Try Out Matematika SMP Semester 1', date: '2026-10-12', answers: seed(6, 5), minutes: 55 },
]
export const addResult = (r: Result) => { results.unshift(r) }

export const weekly = [
  { day: 'Sen', menit: 35, soal: 20 }, { day: 'Sel', menit: 50, soal: 28 }, { day: 'Rab', menit: 20, soal: 10 },
  { day: 'Kam', menit: 65, soal: 36 }, { day: 'Jum', menit: 45, soal: 24 }, { day: 'Sab', menit: 80, soal: 44 }, { day: 'Min', menit: 55, soal: 30 },
]
export const trend = [{ minggu: 'M1', nilai: 58 }, { minggu: 'M2', nilai: 63 }, { minggu: 'M3', nilai: 61 }, { minggu: 'M4', nilai: 70 }, { minggu: 'M5', nilai: 74 }, { minggu: 'M6', nilai: 81 }]
export const subjectPerf = [{ mapel: 'Matematika', nilai: 78 }, { mapel: 'IPA', nilai: 84 }, { mapel: 'Bahasa', nilai: 71 }, { mapel: 'IPS', nilai: 66 }]
export const progress = [{ courseId: 'c1', pct: 62 }, { courseId: 'c3', pct: 35 }, { courseId: 'c5', pct: 90 }]
export const streakDays = [true, true, true, true, true, true, true]

export type ActivityType = 'materi' | 'ujian' | 'akun'
export const activities: { id: string; type: ActivityType; text: string; date: string }[] = [
  { id: 'a1', type: 'ujian', text: 'Menyelesaikan Try Out Matematika SMP Semester 1 (skor 70)', date: '2026-10-28' },
  { id: 'a2', type: 'materi', text: 'Menyelesaikan pelajaran 14 di Aljabar Dasar', date: '2026-10-27' },
  { id: 'a3', type: 'ujian', text: 'Menyelesaikan Latihan Soal IPA Kelas 6 (skor 90)', date: '2026-10-24' },
  { id: 'a4', type: 'materi', text: 'Memulai Bahasa Indonesia: Teks Eksposisi', date: '2026-10-22' },
  { id: 'a5', type: 'akun', text: 'Mengubah tujuan belajar harian menjadi 45 menit', date: '2026-10-20' },
  { id: 'a6', type: 'ujian', text: 'Menyelesaikan Bahasa Inggris: Reading Comprehension (skor 60)', date: '2026-10-19' },
  { id: 'a7', type: 'materi', text: 'Menyelesaikan Biologi: Sistem Pencernaan (90%)', date: '2026-10-16' },
  { id: 'a8', type: 'akun', text: 'Bergabung dengan GradeUp', date: '2026-10-01' },
]
