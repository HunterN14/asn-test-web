import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import { useQuizData } from '../context/QuizDataContext'

export default function History() {
  const { history } = useQuizData()
  const reversed = [...history].reverse()

  return (
    <AppShell title="Riwayat" subtitle={`${history.length} sesi tercatat`}>
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        {reversed.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">Belum ada sesi latihan.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted-soft">
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Hasil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {reversed.map((h, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-muted">{h.date}</td>
                  <td className="px-4 py-3"><Badge tone={h.mode === 'Ujian Penuh' ? 'accent' : 'primary'}>{h.mode}</Badge></td>
                  <td className="px-4 py-3 text-text">{h.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  )
}
