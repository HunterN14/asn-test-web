import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { explainAnswer } from '../lib/anthropic'
import { explainAnswerOllama } from '../lib/ollama'
import { getApiKey, getAiProvider, getOllamaConfig } from '../lib/storage'

export default function AiExplain({ question }) {
  const [state, setState] = useState('idle') // idle | loading | done | nokey | error
  const [text, setText] = useState('')

  async function handleClick() {
    const provider = getAiProvider()
    setState('loading')
    try {
      let result
      if (provider === 'ollama') {
        const { baseUrl, model } = getOllamaConfig()
        result = await explainAnswerOllama({ baseUrl, model, question })
      } else {
        const apiKey = getApiKey()
        if (!apiKey) { setState('nokey'); return }
        result = await explainAnswer({ apiKey, question })
      }
      setText(result)
      setState('done')
    } catch (e) {
      setState('error')
    }
  }

  if (state === 'idle') {
    return (
      <button onClick={handleClick} className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-2 text-sm font-medium text-primary-dark hover:bg-primary-soft/70">
        <Sparkles size={15} /> Lihat Pembahasan AI
      </button>
    )
  }
  if (state === 'loading') {
    return <div className="mt-3 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted">Menyusun pembahasan...</div>
  }
  if (state === 'nokey') {
    return (
      <div className="mt-3 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted">
        Fitur ini butuh Anthropic API key. Atur di <Link to="/pengaturan" className="text-primary hover:underline">Pengaturan</Link>.
      </div>
    )
  }
  if (state === 'error') {
    return (
      <div className="mt-3 rounded-lg border border-dashed border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
        Gagal memuat pembahasan. Cek koneksi/model di <Link to="/pengaturan" className="underline">Pengaturan</Link> (pastikan Ollama berjalan) lalu coba lagi.
      </div>
    )
  }
  return <div className="mt-3 rounded-lg border border-dashed border-line bg-canvas px-3 py-2 text-sm text-text">{text}</div>
}
