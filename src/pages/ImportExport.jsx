import { useRef, useState } from 'react'
import { Download, Upload, Copy, Check } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import { useQuizData } from '../context/QuizDataContext'

export default function ImportExport() {
  const { questions, passingGrade, importQuestions } = useQuizData()
  const [exported, setExported] = useState('')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef(null)

  function handleExport() {
    const payload = JSON.stringify({ questions, passingGrade, exportedAt: new Date().toISOString() }, null, 2)
    setExported(payload)
    setCopied(false)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'soal-asn.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleCopy() {
    navigator.clipboard.writeText(exported).then(() => setCopied(true))
  }

  function handleImport(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!Array.isArray(parsed.questions)) throw new Error('invalid')
        const replace = confirm('OK = Ganti semua soal yang ada.\nBatal = Tambahkan ke daftar soal saat ini.')
        importQuestions(parsed.questions, parsed.passingGrade, replace ? 'replace' : 'append')
        alert(`Impor berhasil: ${parsed.questions.length} soal.`)
      } catch (e) {
        alert('Gagal impor: file JSON tidak valid.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <AppShell title="Impor / Ekspor" subtitle="Cadangkan atau pindahkan bank soal antar perangkat">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="mb-1 text-sm font-semibold text-text">Ekspor Soal</h3>
          <p className="mb-4 text-sm text-muted">Simpan seluruh soal dan passing grade sebagai file JSON.</p>
          <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
            <Download size={16} /> Ekspor Sekarang
          </button>
          {exported && (
            <div className="mt-4">
              <textarea readOnly rows={8} value={exported} className="w-full rounded-lg border border-line bg-canvas p-3 font-mono text-xs" />
              <button onClick={handleCopy} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Tersalin' : 'Salin ke clipboard'}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="mb-1 text-sm font-semibold text-text">Impor Soal</h3>
          <p className="mb-4 text-sm text-muted">Unggah file JSON hasil ekspor untuk menambah atau mengganti bank soal.</p>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-text hover:bg-canvas">
            <Upload size={16} /> Pilih File JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => handleImport(e.target.files[0])} />
        </div>
      </div>
    </AppShell>
  )
}
