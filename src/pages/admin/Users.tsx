import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import ConfirmDialog from '@/components/ConfirmDialog'
import Field from '@/components/Field'
import Modal from '@/components/Modal'
import SearchBox from '@/components/SearchBox'
import { useToast } from '@/components/Toast'
import { isEmail } from '@/utils/validators'
import { Shield, UserCheck, Award, Calendar } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  email: string
  role: string
  plan: string
  subscription_expires_at: string | null
  created_at?: string
}

export default function Users() {
  const toast = useToast()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  // State untuk Detail / Edit Modal & Pengaturan Paket Premium
  const [draft, setDraft] = useState<Profile | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState(false)
  
  // State untuk Durasi Paket Premium
  const [durationValue, setDurationValue] = useState(30)
  const [durationUnit, setDurationUnit] = useState<'days' | 'months' | 'years'>('days')

  // 1. Ambil data awal dan aktifkan Supabase Realtime
  useEffect(() => {
    fetchUsers()

    if (!supabase) return

    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new as Profile
            setUsers((prev) => [newUser, ...prev])
            toast(`Pengguna baru terdeteksi: ${newUser.full_name || newUser.email}`)
          } else if (payload.eventType === 'UPDATE') {
            const updatedUser = payload.new as Profile
            setUsers((prev) =>
              prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [])

  async function fetchUsers() {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast(`Gagal memuat pengguna: ${error.message}`)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  // Filter pencarian & status
  const list = useMemo(() => {
    return users.filter((u) => {
      const matchQuery = ((u.full_name || '') + ' ' + (u.email || '')).toLowerCase().includes(q.trim().toLowerCase())
      const matchPlan = !planFilter || u.plan === planFilter
      const matchRole = !roleFilter || u.role === roleFilter
      return matchQuery && matchPlan && matchRole
    })
  }, [users, q, planFilter, roleFilter])

  // Simpan perubahan profil dasar (nama)
  async function save(e: FormEvent) {
    e.preventDefault()
    if (!draft || !supabase) return
    const er: Record<string, string> = {}
    if (!draft.full_name || draft.full_name.trim().length < 2) er.name = 'Nama minimal 2 karakter'
    if (!isEmail(draft.email)) er.email = 'Masukkan email yang valid'
    setErr(er)
    if (Object.keys(er).length) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: draft.full_name.trim() })
      .eq('id', draft.id)

    if (error) {
      toast(`Gagal memperbarui: ${error.message}`)
      return
    }

    toast('Profil pengguna diperbarui')
    setDraft(null)
    fetchUsers()
  }

  // Fungsi Aktifkan Paket Premium dengan Durasi Fleksibel
  async function handleSavePackage() {
    if (!draft || !supabase) return

    const now = new Date()
    if (durationUnit === 'days') {
      now.setDate(now.getDate() + Number(durationValue))
    } else if (durationUnit === 'months') {
      now.setMonth(now.getMonth() + Number(durationValue))
    } else if (durationUnit === 'years') {
      now.setFullYear(now.getFullYear() + Number(durationValue))
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        plan: 'Premium',
        subscription_expires_at: now.toISOString(),
      })
      .eq('id', draft.id)

    if (error) {
      toast(`Gagal atur paket: ${error.message}`)
    } else {
      toast(`Paket Premium diaktifkan hingga ${now.toLocaleDateString('id-ID')}`)
      setDraft(null)
      fetchUsers()
    }
  }

  // Ubah kembali ke Paket Free / Cabut Premium
  async function handleSetFree() {
    if (!draft || !supabase) return

    const { error } = await supabase
      .from('profiles')
      .update({
        plan: 'Free',
        subscription_expires_at: null,
      })
      .eq('id', draft.id)

    if (error) {
      toast(`Gagal mengubah paket: ${error.message}`)
    } else {
      toast('Paket diubah menjadi Free')
      setDraft(null)
      fetchUsers()
    }
    setConfirm(false)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Pengguna</h1>
        <div className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
          Total User: {users.length} Orang
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_150px_170px]">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nama atau email" />
        <select className="input" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} aria-label="Paket">
          <option value="">Semua paket</option>
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
        </select>
        <select className="input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Role">
          <option value="">Semua role</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <p className="card p-8 text-center text-sm text-muted">Memuat data pengguna...</p>
      ) : list.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">Tidak ada pengguna yang cocok.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="p-4">Pengguna</th>
                <th className="p-4">Role</th>
                <th className="p-4">Paket</th>
                <th className="p-4">Masa Aktif</th>
                <th className="p-4">Bergabung</th>
                <th className="p-4 text-right" />
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-border/20 transition-colors">
                  <td className="p-4">
                    <b>{u.full_name || 'Tanpa Nama'}</b><br />
                    <span className="text-xs text-muted">{u.email}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-600' : 'bg-blue-500/10 text-blue-600'}`}>
                      {u.role === 'admin' ? <Shield size={12} /> : <UserCheck size={12} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.plan === 'Premium' ? 'gradient-brand text-white' : 'bg-gray-500/10 text-gray-600'}`}>
                      <Award size={12} />
                      {u.plan || 'Free'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted">
                    {u.subscription_expires_at ? (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(u.subscription_expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-4 text-muted text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <button className="font-semibold text-primary text-xs btn-ghost px-3 py-1.5 border border-border" onClick={() => { setErr({}); setDraft(u); setDurationValue(30); setDurationUnit('days'); }}>
                      Kelola Paket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail & Kelola Paket */}
      <Modal open={draft !== null} onClose={() => setDraft(null)} title="Kelola Pengguna & Paket">
        {draft && (
          <div className="space-y-4">
            <form onSubmit={save} noValidate className="space-y-3 border-b border-border pb-4">
              <Field label="Nama lengkap" name="name" value={draft.full_name || ''} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} error={err.name} />
              <Field label="Email" name="email" type="email" value={draft.email} disabled />
              <button className="btn-ghost w-full border border-border text-xs">Simpan Perubahan Nama</button>
            </form>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm">Pengaturan Paket Premium</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Durasi</label>
                  <input
                    type="number"
                    min={1}
                    value={durationValue}
                    onChange={(e) => setDurationValue(Number(e.target.value))}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Satuan</label>
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as any)}
                    className="input w-full"
                  >
                    <option value="days">Hari</option>
                    <option value="months">Bulan</option>
                    <option value="years">Tahun</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {draft.plan === 'Premium' && (
                  <button type="button" className="btn-ghost flex-1 border border-red-200 text-red-500 hover:bg-red-50 text-xs" onClick={() => setConfirm(true)}>
                    Cabut Premium (Free)
                  </button>
                )}
                <button type="button" onClick={handleSavePackage} className="btn-primary flex-1 text-xs">
                  {draft.plan === 'Premium' ? 'Perpanjang Premium' : 'Aktifkan Premium'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleSetFree}
        danger
        title="Cabut Status Premium?"
        confirmLabel="Ya, Jadikan Free"
        message="Pengguna akan dikembalikan ke paket Free dan kehilangan akses premium."
      />
    </div>
  )
}
