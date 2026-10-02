import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import useCountdown from '../hooks/useCountdown'
import { useQuizData } from '../context/QuizDataContext'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ExamFlow() {
  const { questions, categories, passingGrade, ensurePassingGrade, recordSession } = useQuizData()
  const [phase, setPhase] = useState('setup')
  const [cat, setCat] = useState('all')
  const [minutes, setMinutes] = useState(100)
  const [order, setOrder] = useState([])
  const [answers, setAnswers] = useState([])
  const [idx, setIdx] = useState(0)
  const [result, setResult] = useState(null)

  const countdown = useCountdown(() => finish())

  function startExam() {
    const pool = cat === 'all' ? questions : questions.filter((q) => (q.cat || 'Umum') === cat)
    if (pool.length === 0) { alert('Tidak ada soal untuk pilihan ini.'); return }
    const shuffled = shuffle(pool)
    setOrder(shuffled)
    setAnswers(new Array(shuffled.length).fill(null))
    setIdx(0)
    setPhase('session')
    countdown.start(minutes * 60, 1000)
  }

  function pick(i) {
    setAnswers((prev) => prev.map((a, ai) => (ai === idx ? i : a)))
  }

  function finish() {
    countdown.stop()
    const byCat = {}
    order.forEach((q, i) => {
      const c = q.cat || 'Umum'
      byCat[c] = byCat[c] || { correct: 0, total: 0, points: 0 }
      byCat[c].total++
      if (answers[i] === q.correct) { byCat[c].correct++; byCat[c].points += 5 }
    })
    Object.keys(byCat).forEach(ensurePassingGrade)
    const totalCorrect = Object.values(byCat).reduce((s, c) => s + c.correct, 0)
    const allPass = Object.entries(byCat).every(([c, v]) => v.points >= (passingGrade[c] ?? 60))
    recordSession({
      mode: 'Ujian Penuh', correct: totalCorrect, total: order.length,
      summary: `${totalCorrect}/${order.length} — ${allPass ? 'LULUS' : 'TIDAK LULUS'}`,
    })
    setResult({ byCat, allPass })
    setPhase('result')
  }

  function reset() { setPhase('setup') }

  if (phase === 'setup') {
    return (
      <AppShell title="Ujian Penuh" subtitle="Simulasi ujian dengan waktu total dan penilaian akhir">
        <div className="max-w-lg rounded-xl border border-line bg-surface p-5">
          <label className="mb-1 block text-sm font-medium text-text">Kategori</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring">
            <option value="all">Semua Kategori</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="mb-1 mt-4 block text-sm font-medium text-text">Durasi ujian (menit)</label>
          <input type="number" min={5} value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value) || 100)} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring" />
          <p className="mt-2 text-xs text-muted">Poin per jawaban benar = 5. Passing grade dicek per kategori di akhir ujian.</p>
          <button onClick={startExam} className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
            Mulai Ujian
          </button>
        </div>
      </AppShell>
    )
  }

  if (phase === 'session') {
    const q = order[idx]
    const m = Math.floor(countdown.timeLeft / 60)
    const s = Math.floor(countdown.timeLeft % 60)
    const doneCount = answers.filter((a) => a !== null).length
    const low = countdown.timeLeft < 60
    return (
      <AppShell
        title="Ujian Penuh"
        subtitle={`${doneCount}/${order.length} terjawab`}
        actions={<span className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${low ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary-dark'}`}>⏱ {m}:{s.toString().padStart(2, '0')}</span>}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface p-5 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Badge tone="primary">{q.cat || 'Umum'}</Badge>
              <span className="text-sm text-muted">Soal {idx + 1}/{order.length}</span>
            </div>
            <p className="mt-4 text-base font-medium text-text">{q.q}</p>
            <div className="mt-4 space-y-2">
              {q.opts.map((o, i) => (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${answers[idx] === i ? 'border-primary bg-primary-soft' : 'border-line hover:border-muted-soft'}`}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-medium disabled:opacity-40">
                Sebelumnya
              </button>
              {idx + 1 < order.length ? (
                <button onClick={() => setIdx((i) => i + 1)} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                  Berikutnya
                </button>
              ) : (
                <button onClick={() => { if (confirm('Selesaikan ujian sekarang?')) finish() }} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                  Selesai
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-semibold text-text">Peta Nomor Soal</p>
            <div className="grid grid-cols-6 gap-1.5">
              {order.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-md border py-2 text-xs font-medium ${
                    i === idx ? 'border-accent ring-1 ring-accent' : answers[i] !== null ? 'border-primary bg-primary text-white' : 'border-line'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={() => { if (confirm('Selesaikan ujian sekarang?')) finish() }} className="mt-4 w-full rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
              Selesaikan lebih awal
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Hasil Ujian Penuh">
      <div className="max-w-lg space-y-4">
        <div className={`rounded-xl border p-6 text-center ${result.allPass ? 'border-success/30 bg-success-soft' : 'border-danger/30 bg-danger-soft'}`}>
          <p className={`text-2xl font-bold ${result.allPass ? 'text-success' : 'text-danger'}`}>
            {result.allPass ? 'LULUS' : 'TIDAK LULUS'}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="mb-3 text-sm font-semibold text-text">Rincian per Kategori</p>
          <div className="divide-y divide-line">
            {Object.entries(result.byCat).map(([c, v]) => {
              const pg = passingGrade[c] ?? 60
              const pass = v.points >= pg
              return (
                <div key={c} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="font-medium text-text">{c}</p>
                    <p className="text-xs text-muted">Benar: {v.correct}/{v.total} · Skor: {v.points} · Passing grade: {pg}</p>
                  </div>
                  <Badge tone={pass ? 'success' : 'danger'}>{pass ? 'Lulus' : 'Belum'}</Badge>
                </div>
              )
            })}
          </div>
        </div>
        <button onClick={reset} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          Sesi Baru
        </button>
      </div>
    </AppShell>
  )
}
