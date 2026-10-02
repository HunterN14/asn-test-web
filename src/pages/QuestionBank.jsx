import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Inbox } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import SlideOver from '../components/ui/SlideOver'
import QuestionForm from '../components/QuestionForm'
import { useQuizData } from '../context/QuizDataContext'

const DIFF_TONE = { Mudah: 'success', Sedang: 'accent', Sulit: 'danger' }

export default function QuestionBank() {
  const { questions, categories, addQuestion, updateQuestion, deleteQuestion } = useQuizData()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [panelOpen, setPanelOpen] = useState(params.get('new') === '1')

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesCat = catFilter === 'all' || (q.cat || 'Umum') === catFilter
      const matchesSearch = q.q.toLowerCase().includes(search.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [questions, catFilter, search])

  function openAdd() {
    setEditing(null)
    setPanelOpen(true)
  }
  function openEdit(q) {
    setEditing(q)
    setPanelOpen(true)
  }
  function closePanel() {
    setPanelOpen(false)
    setEditing(null)
    if (params.get('new')) setParams({}, { replace: true })
  }
  function handleSubmit(payload) {
    if (editing) updateQuestion(editing.id, payload)
    else addQuestion(payload)
    closePanel()
  }
  function handleDelete(id) {
    if (confirm('Hapus soal ini? Tindakan ini tidak bisa dibatalkan.')) deleteQuestion(id)
  }

  return (
    <AppShell
      title="Bank Soal"
      subtitle={`${questions.length} soal tersimpan`}
      actions={
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          <Plus size={16} /> Tambah Soal
        </button>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-sm focus-ring"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm focus-ring sm:w-48"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Inbox size={28} className="text-muted-soft" />
            <p className="text-sm text-muted">
              {questions.length === 0 ? 'Belum ada soal. Tambahkan soal pertamamu.' : 'Tidak ada soal yang cocok dengan pencarian.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted-soft">
                  <th className="w-14 px-4 py-3 font-medium">No</th>
                  <th className="px-4 py-3 font-medium">Pertanyaan</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Kesulitan</th>
                  <th className="px-4 py-3 font-medium">Jawaban Benar</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((q, index) => (
                  <tr key={q.id} className="hover:bg-canvas/60">
                    <td className="px-4 py-3 text-muted">{index + 1}</td>
                    <td className="max-w-xs px-4 py-3 text-text">{q.q}</td>
                    <td className="px-4 py-3"><Badge tone="primary">{q.cat || 'Umum'}</Badge></td>
                    <td className="px-4 py-3"><Badge tone={DIFF_TONE[q.difficulty] || 'neutral'}>{q.difficulty || 'Sedang'}</Badge></td>
                    <td className="px-4 py-3 text-muted">{q.opts[q.correct]}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(q)} className="rounded-lg p-2 text-muted hover:bg-primary-soft hover:text-primary-dark focus-ring" aria-label="Ubah">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="rounded-lg p-2 text-muted hover:bg-danger-soft hover:text-danger focus-ring" aria-label="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={panelOpen} onClose={closePanel} title={editing ? 'Ubah Soal' : 'Tambah Soal Baru'}>
        <QuestionForm initial={editing} categories={categories} onSubmit={handleSubmit} onCancel={closePanel} />
      </SlideOver>
    </AppShell>
  )
}
