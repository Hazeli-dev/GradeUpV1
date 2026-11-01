import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts'
import { ClipboardCheck, Crown, Users, Wallet, Sparkles, TrendingUp } from 'lucide-react'
import { monthly, revenueByPlan, trxStore, usersStore, visitors } from '@/data/admin'
import { useStore } from '@/lib/store'
import StatusBadge from '@/components/StatusBadge'
import { axisProps, chartColors, tooltipStyle } from '@/components/ChartCard'
import { fmtDate, rupiah } from '@/utils/format'

const grid = <CartesianGrid stroke="#94a3b8" strokeOpacity={0.15} vertical={false} />

export default function Overview() {
  const users = useStore(usersStore)
  const trx = useStore(trxStore)
  
  const revenue = trx.filter((t) => t.status === 'Berhasil').reduce((s, t) => s + t.amount, 0)
  const recent = [...users].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 5)
  const premiumCount = users.filter((u) => u.plan === 'Premium').length

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ringkasan statistik pengguna, pendapatan, dan aktivitas platform GradeUp.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-medium">Status Sistem</div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Normal
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pengguna</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900">{users.length}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Terdaftar di sistem
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengguna Premium</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Crown className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900">{premiumCount}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {((premiumCount / (users.length || 1)) * 100).toFixed(1)}% dari total user
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendapatan (Sukses)</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Wallet className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900">{rupiah(revenue)}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Terverifikasi sistem</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ujian Bulan Ini</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><ClipboardCheck className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900">{monthly[11].ujian.toLocaleString('id-ID')}</div>
          <div className="text-xs text-purple-600 font-medium mt-1">Aktivitas ujian aktif</div>
        </div>
      </div>

      {/* GRAFIK UTAMA */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Pengunjung 30 Hari Terakhir</h3>
            <span className="text-xs text-slate-400">Statistik harian</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitors}>
                {grid}
                <XAxis dataKey="hari" {...axisProps} stroke="#cbd5e1" />
                <YAxis {...axisProps} stroke="#cbd5e1" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="pengunjung" name="Pengunjung" stroke="#6366F1" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#6366F1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-2">Pendapatan per Paket (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByPlan} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {revenueByPlan.map((p, i) => <Cell key={p.name} fill={chartColors[i % chartColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GRAFIK AREA */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Pertumbuhan Pengguna Baru (12 Bulan)</h3>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">Tren Positif</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly}>
              {grid}
              <XAxis dataKey="bulan" {...axisProps} stroke="#cbd5e1" />
              <YAxis {...axisProps} stroke="#cbd5e1" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="pengguna" name="Pengguna baru" stroke="#10B981" strokeWidth={2.5} fill="#10B981" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LIST AKTIVITAS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Pendaftaran Terbaru</h3>
            <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">Lihat Semua</span>
          </div>
          <ul className="space-y-3.5">
            {recent.map((u) => (
              <li key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {u.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <b className="text-sm text-slate-900 block">{u.name}</b>
                    <span className="text-xs text-slate-400">{u.email}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{fmtDate(u.joined)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Transaksi Terbaru</h3>
            <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">Lihat Semua</span>
          </div>
          <ul className="space-y-3.5">
            {trx.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    Rp
                  </div>
                  <div>
                    <b className="text-sm text-slate-900 block">{t.user}</b>
                    <span className="text-xs text-slate-500">{t.plan} · <strong className="text-slate-700">{rupiah(t.amount)}</strong></span>
                  </div>
                </div>
                <StatusBadge label={t.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center pt-2 pb-4">
        <p className="text-xs text-slate-400 font-medium">GradeUp Admin Panel · Data contoh sistem (demo mode)</p>
      </div>
    </div>
  )
}
