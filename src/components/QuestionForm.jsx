import { useState } from 'react'

const DIFFICULTIES = ['Mudah', 'Sedang', 'Sulit']

export default function QuestionForm({ initial, categories, onSubmit, onCancel }) {
  const [cat, setCat] = useState(initial?.cat || '')
  const [q, setQ] = useState(initial?.q || '')
  const [opts, setOpts] = useState(initial?.opts || ['', '', '', ''])
  const [correct, setCorrect] = useState(initial?.correct ?? 0)
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'Sedang')
  const [error, setError] = useState('')

  function updateOpt(i, val) {
    setOpts((prev) => prev.map((o, idx) => (idx === i ? val : o)))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!cat.trim() || !q.trim() || opts.some((o) => !o.trim())) {
      setError('Lengkapi kategori, pertanyaan, dan semua pilihan jawaban.')
      return
    }
    onSubmit({ cat: cat.trim(), q: q.trim(), opts: opts.map((o) => o.trim()), correct, difficulty })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-text">Kategori</label>
        <input
          list="category-options"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          placeholder="TWK / TIU / TKP"
          className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring"
        />
        <datalist id="category-options">
          {categories.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">Tingkat kesulitan</label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                difficulty === d ? 'border-primary bg-primary-soft text-primary-dark' : 'border-line text-muted hover:border-muted-soft'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">Pertanyaan</label>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">Pilihan jawaban</label>
        <p className="mb-2 text-xs text-muted">Pilih radio untuk menandai jawaban yang benar.</p>
        <div className="space-y-2">
          {opts.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={correct === i}
                onChange={() => setCorrect(i)}
                className="h-4 w-4 accent-[#0d9488]"
              />
              <input
                value={o}
                onChange={(e) => updateOpt(i, e.target.value)}
                placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                className="flex-1 rounded-lg border border-line px-3 py-2 text-sm focus-ring"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          {initial ? 'Simpan Perubahan' : 'Tambah Soal'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-text hover:bg-canvas">
          Batal
        </button>
      </div>
    </form>
  )
}
