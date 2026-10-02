import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import { useQuizData } from '../context/QuizDataContext'

export default function PassingGrade() {
  const { categories, passingGrade, setPassingGrade } = useQuizData()

  return (
    <AppShell title="Passing Grade" subtitle="Ambang skor kelulusan untuk setiap kategori">
      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="mb-5 text-sm text-muted">
          Skor dihitung 5 poin per jawaban benar, mengikuti sistem SKD. Nilai ini menjadi acuan lulus/tidak
          saat kamu menyelesaikan sesi Ujian Penuh.
        </p>
        {categories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line py-10 text-center text-sm text-muted">
            Belum ada kategori. Tambahkan soal terlebih dahulu di Bank Soal.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {categories.map((c) => (
              <div key={c} className="flex items-center justify-between gap-4 py-3">
                <Badge tone="primary">{c}</Badge>
                <input
                  type="number"
                  value={passingGrade[c] ?? 60}
                  onChange={(e) => setPassingGrade(c, parseInt(e.target.value) || 0)}
                  className="w-28 rounded-lg border border-line px-3 py-1.5 text-right text-sm focus-ring"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
