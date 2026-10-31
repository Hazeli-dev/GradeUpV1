import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts'
import { ClipboardCheck, Crown, Users, Wallet } from 'lucide-react'
import { monthly, revenueByPlan, trxStore, usersStore, visitors } from '@/data/admin'
import { useStore } from '@/lib/store'
import StatCard from '@/components/StatCard'
import StatusBadge from '@/components/StatusBadge'
import ChartCard, { axisProps, chartColors, tooltipStyle } from '@/components/ChartCard'
import { fmtDate, rupiah } from '@/utils/format'

const grid = <CartesianGrid stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />

export default function Overview() {
  const users = useStore(usersStore); const trx = useStore(trxStore)
  const revenue = trx.filter((t) => t.status === 'Berhasil').reduce((s, t) => s + t.amount, 0)
  const recent = [...users].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 5)
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total pengguna" value={String(users.length)} icon={Users} />
        <StatCard label="Pengguna premium" value={String(users.filter((u) => u.plan === 'Premium').length)} icon={Crown} />
        <StatCard label="Pendapatan (sukses)" value={rupiah(revenue)} icon={Wallet} />
        <StatCard label="Ujian bulan ini" value={monthly[11].ujian.toLocaleString('id-ID')} icon={ClipboardCheck} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartCard title="Pengunjung 30 hari terakhir">
          <ResponsiveContainer><LineChart data={visitors}>{grid}<XAxis dataKey="hari" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="pengunjung" name="Pengunjung" stroke="#0F766E" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></ChartCard></div>
        <ChartCard title="Pendapatan per paket (%)">
          <ResponsiveContainer><PieChart><Pie data={revenueByPlan} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
            {revenueByPlan.map((p, i) => <Cell key={p.name} fill={chartColors[i]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend /></PieChart></ResponsiveContainer></ChartCard>
      </div>
      <ChartCard title="Pertumbuhan pengguna baru (12 bulan)">
        <ResponsiveContainer><AreaChart data={monthly}>{grid}<XAxis dataKey="bulan" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="pengguna" name="Pengguna baru" stroke="#10B981" fill="#10B981" fillOpacity={0.2} /></AreaChart></ResponsiveContainer>
      </ChartCard>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5"><h3 className="mb-3 text-sm font-bold">Pendaftaran terbaru</h3>
          <ul className="space-y-3 text-sm">{recent.map((u) => <li key={u.id} className="flex justify-between gap-2"><span><b>{u.name}</b><br /><span className="text-xs text-muted">{u.email}</span></span><span className="text-xs text-muted">{fmtDate(u.joined)}</span></li>)}</ul></div>
        <div className="card p-5"><h3 className="mb-3 text-sm font-bold">Transaksi terbaru</h3>
          <ul className="space-y-3 text-sm">{trx.slice(0, 5).map((t) => <li key={t.id} className="flex items-center justify-between gap-2"><span><b>{t.user}</b><br /><span className="text-xs text-muted">{t.plan} · {rupiah(t.amount)}</span></span><StatusBadge label={t.status} /></li>)}</ul></div>
      </div>
      <p className="text-xs text-muted">Data contoh (demo).</p>
    </div>
  )
}
