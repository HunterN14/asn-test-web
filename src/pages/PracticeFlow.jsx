import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import AiExplain from '../components/AiExplain'
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
const SEC_OPTIONS = [15, 30, 45, 60]

export default function PracticeFlow() {
  const { questions, categories, wrongIds, recordSession } = useQuizData()
  const [params] = useSearchParams()
  const wrongBank = params.get('bank') === 'wrong'

  const [phase, setPhase] = useState('setup')
  const [cat, setCat] = useState('all')
  const [sec, setSec] = useState(30)
  const [order, setOrder] = useState([])
  const [idx, setIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [sessionWrong, setSessionWrong] = useState([])
  const [sessionFixed, setSessionFixed] = useState([])

  const countdown = useCountdown(() => { if (!answered) handleAnswer(-1) })

  function startSession() {
    let pool = wrongBank
      ? questions.filter((q) => wrongIds.includes(q.id))
      : cat === 'all' ? questions : questions.filter((q) => (q.cat || 'Umum') === cat)
    if (pool.length === 0) { alert('Tidak ada soal untuk pilihan ini.'); return }
    const shuffled = shuffle(pool)
    setOrder(shuffled)
    setIdx(0)
    setCorrectCount(0)
    setSessionWrong([])
    setSessionFixed([])
    setAnswered(false)
    setPicked(null)
    setPhase('session')
    countdown.start(sec, 100)
  }

  function handleAnswer(i) {
    if (answered) return
    setAnswered(true)
    setPicked(i)
    countdown.stop()
    const q = order[idx]
    if (i === q.correct) {
      setCorrectCount((c) => c + 1)
      if (wrongIds.includes(q.id)) setSessionFixed((f) => [...f, q.id])
    } else {
      setSessionWrong((w) => [...w, q.id])
    }
  }

  function next() {
    if (idx + 1 >= order.length) {
      finish()
    } else {
      setIdx((i) => i + 1)
      setAnswered(false)
      setPicked(null)
      countdown.start(sec, 100)
    }
  }

  function finish() {
    const total = order.length
    const pct = Math.round((correctCount / total) * 100)
    recordSession({
      mode: 'Latihan', correct: correctCount, total,
      summary: `${pct}% (${correctCount}/${total})`,
      wrongIds: sessionWrong, fixedIds: sessionFixed,
    })
    setPhase('result')
  }

  function reset() { setPhase('setup') }

  if (phase === 'setup') {
    return (
      <AppShell title="Latihan" subtitle="Latihan per soal dengan pembahasan langsung">
        <div className="max-w-lg rounded-xl border border-line bg-surface p-5">
          {wrongBank && (
            <div className="mb-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              Mode latihan soal yang pernah salah ({wrongIds.length} soal).
            </div>
          )}
          {!wrongBank && (
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Kategori</label>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring">
                <option value="all">Semua Kategori</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-text">Waktu per soal</label>
            <div className="flex gap-2">
              {SEC_OPTIONS.map((s) => (
                <button key={s} onClick={() => setSec(s)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${sec === s ? 'border-primary bg-primary-soft text-primary-dark' : 'border-line text-muted'}`}>
                  {s}s
                </button>
              ))}
            </div>
          </div>
          <button onClick={startSession} className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
            Mulai Latihan
          </button>
        </div>
      </AppShell>
    )
  }

  if (phase === 'session') {
    const q = order[idx]
    const pct = (countdown.timeLeft / countdown.duration) * 100
    return (
      <AppShell title="Latihan" subtitle={`Soal ${idx + 1} dari ${order.length}`}>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-primary transition-all" style={{ width: `${((idx) / order.length) * 100}%` }} />
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <Badge tone="primary">{q.cat || 'Umum'}</Badge>
            <span className="text-sm font-medium text-muted">Benar: {correctCount}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas">
            <div className="h-full bg-accent transition-all" style={{ width: `${Math.max(pct, 0)}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">{Math.ceil(countdown.timeLeft)}s</p>

          <p className="mt-4 text-base font-medium text-text">{q.q}</p>

          <div className="mt-4 space-y-2">
            {q.opts.map((o, i) => {
              let cls = 'border-line hover:border-muted-soft'
              if (answered) {
                if (i === q.correct) cls = 'border-success bg-success-soft'
                else if (i === picked) cls = 'border-danger bg-danger-soft'
              }
              return (
                <button key={i} disabled={answered} onClick={() => handleAnswer(i)} className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${cls}`}>
                  {o}
                </button>
              )
            })}
          </div>

          {answered && (
            <>
              <AiExplain question={q} />
              <button onClick={next} className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                {idx + 1 < order.length ? 'Lanjut' : 'Lihat Hasil'}
              </button>
            </>
          )}
        </div>
      </AppShell>
    )
  }

  const total = order.length
  const pct = Math.round((correctCount / total) * 100)
  return (
    <AppShell title="Hasil Latihan">
      <div className="max-w-md rounded-xl border border-line bg-surface p-6 text-center">
        <div className="text-5xl font-bold text-primary">{pct}%</div>
        <p className="mt-2 text-sm text-muted">{correctCount} benar dari {total} soal</p>
        <div className="mt-5 flex gap-2">
          <button onClick={reset} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">Sesi Baru</button>
        </div>
      </div>
    </AppShell>
  )
}
