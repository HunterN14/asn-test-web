import { Link } from 'react-router-dom'
import { Trophy, ListChecks, LayoutGrid, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { useQuizData } from '../context/QuizDataContext'

export default function Dashboard() {
  const { best, totalTaken, questions, categories, history, wrongIds } = useQuizData()

  const recent = [...history].reverse().slice(0, 5)

  const catCounts = categories.map((c) => ({
    cat: c,
    count: questions.filter((q) => (q.cat || 'Umum') === c).length,
  }))

  return (
    <AppShell title="Dashboard" subtitle="Ringkasan progres latihan tes ASN kamu">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Skor terbaik" value={`${best}%`} icon={Trophy} tone="accent" />
        <StatCard label="Sesi selesai" value={totalTaken} icon={CheckCircle2} tone="success" />
        <StatCard label="Total soal" value={questions.length} hint={`${categories.length} kategori`} icon={ListChecks} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Soal per kategori</h3>
            <Link to="/soal" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Kelola soal <ArrowRight size={13} />
            </Link>
          </div>
          {catCounts.length === 0 ? (
            <p className="text-sm text-muted">Belum ada soal. Tambahkan soal pertamamu di Bank Soal.</p>
          ) : (
            <div className="space-y-3">
              {catCounts.map(({ cat, count }) => (
                <div key={cat} className="flex items-center gap-3">
                  <Badge tone="primary">{cat}</Badge>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / questions.length) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-muted">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="mb-4 text-sm font-semibold text-text">Aksi cepat</h3>
          <div className="space-y-2">
            <Link to="/latihan" className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium hover:border-primary hover:bg-primary-soft/40">
              📘 Mulai Latihan <ArrowRight size={15} className="text-muted" />
            </Link>
            <Link to="/ujian" className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium hover:border-primary hover:bg-primary-soft/40">
              🧪 Mulai Ujian Penuh <ArrowRight size={15} className="text-muted" />
            </Link>
            <Link to="/soal?new=1" className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium hover:border-primary hover:bg-primary-soft/40">
              ➕ Tambah Soal <ArrowRight size={15} className="text-muted" />
            </Link>
            {wrongIds.length > 0 && (
              <Link to="/latihan?bank=wrong" className="flex items-center justify-between rounded-lg border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm font-medium text-danger">
                <span className="flex items-center gap-2"><XCircle size={15} /> Latih {wrongIds.length} soal salah</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">Riwayat terbaru</h3>
          <Link to="/riwayat" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Lihat semua <ArrowRight size={13} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line py-8 text-center text-sm text-muted">
            Belum ada sesi latihan. Mulai sesi pertamamu untuk melihat riwayat di sini.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {recent.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <LayoutGrid size={14} className="text-muted-soft" />
                  <span className="font-medium text-text">{h.mode}</span>
                  <span className="text-muted">{h.date}</span>
                </div>
                <span className="text-muted">{h.summary}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
