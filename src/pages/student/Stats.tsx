import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { results, scoreOf, subjectPerf, trend, weekly } from '@/data/student'
import ChartCard, { axisProps, chartColors, tooltipStyle } from '@/components/ChartCard'

const grid = <CartesianGrid stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />

export default function Stats() {
  const correct = results.reduce((s, r) => s + scoreOf(r.answers).correct, 0)
  const all = results.reduce((s, r) => s + scoreOf(r.answers).total, 0)
  const pie = [{ name: 'Benar', value: correct }, { name: 'Salah', value: all - correct }]
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Statistik Belajar</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Aktivitas mingguan">
          <ResponsiveContainer><BarChart data={weekly}>{grid}<XAxis dataKey="day" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} /><Legend />
            <Bar dataKey="menit" name="Menit" fill="#0F766E" radius={[6, 6, 0, 0]} /><Bar dataKey="soal" name="Soal" fill="#34D399" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Tren nilai">
          <ResponsiveContainer><LineChart data={trend}>{grid}<XAxis dataKey="minggu" {...axisProps} /><YAxis domain={[40, 100]} {...axisProps} /><Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="nilai" name="Nilai" stroke="#0F766E" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Nilai per mata pelajaran">
          <ResponsiveContainer><BarChart data={subjectPerf} layout="vertical"><CartesianGrid stroke="#94a3b8" strokeOpacity={0.2} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} {...axisProps} /><YAxis type="category" dataKey="mapel" width={90} {...axisProps} /><Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="nilai" name="Nilai" fill="#10B981" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Jawaban benar dan salah">
          <ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
            {pie.map((p, i) => <Cell key={p.name} fill={i === 0 ? chartColors[1] : '#F87171'} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend /></PieChart></ResponsiveContainer>
        </ChartCard>
      </div>
      <p className="text-xs text-muted">Data contoh (demo). Grafik jawaban benar dan salah dihitung dari hasil ujian di halaman Hasil Belajar.</p>
    </div>
  )
}
