import { useState } from 'react'
import { KeyRound, Check, Server, Plug } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import {
  getApiKey, setApiKey, getAiProvider, setAiProvider, getOllamaConfig, setOllamaConfig,
} from '../lib/storage'
import { listOllamaModels } from '../lib/ollama'

export default function Settings() {
  const [provider, setProvider] = useState(getAiProvider())
  const [key, setKey] = useState(getApiKey())
  const [ollama, setOllama] = useState(getOllamaConfig())
  const [saved, setSaved] = useState(false)
  const [test, setTest] = useState({ status: 'idle', msg: '' })

  function handleSave(e) {
    e.preventDefault()
    setAiProvider(provider)
    setApiKey(key.trim())
    setOllamaConfig({ baseUrl: ollama.baseUrl.trim(), model: ollama.model.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleTest() {
    setTest({ status: 'loading', msg: 'Menghubungi Ollama...' })
    try {
      const models = await listOllamaModels(ollama.baseUrl.trim())
      const found = models.includes(ollama.model.trim())
      setTest({
        status: found ? 'ok' : 'warn',
        msg: found
          ? `Terhubung. Model "${ollama.model}" tersedia.`
          : `Terhubung, tetapi model "${ollama.model}" belum ada. Model terpasang: ${models.join(', ') || '(kosong)'}.`,
      })
    } catch (e) {
      setTest({ status: 'error', msg: 'Gagal terhubung. Pastikan Ollama berjalan dan CORS diizinkan (lihat catatan di bawah).' })
    }
  }

  const tab = (id, label, Icon) => (
    <button
      type="button"
      onClick={() => setProvider(id)}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
        provider === id ? 'border-primary bg-primary-soft text-primary-dark' : 'border-line text-muted'
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  )

  const toneCls = { ok: 'text-success', warn: 'text-accent', error: 'text-danger', loading: 'text-muted', idle: '' }

  return (
    <AppShell title="Pengaturan" subtitle="Pilih AI untuk pembahasan jawaban">
      <form onSubmit={handleSave} className="max-w-lg space-y-4 rounded-xl border border-line bg-surface p-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-text">Penyedia AI</p>
          <div className="flex gap-2">
            {tab('ollama', 'Ollama (lokal)', Server)}
            {tab('anthropic', 'Anthropic API', KeyRound)}
          </div>
        </div>

        {provider === 'ollama' ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Alamat Ollama</label>
              <input
                value={ollama.baseUrl}
                onChange={(e) => setOllama({ ...ollama, baseUrl: e.target.value })}
                placeholder="http://localhost:11434"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Nama model</label>
              <input
                value={ollama.model}
                onChange={(e) => setOllama({ ...ollama, model: e.target.value })}
                placeholder="llama3.1:8b"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring"
              />
              <p className="mt-1 text-xs text-muted">Sama persis dengan hasil perintah <code>ollama list</code>.</p>
            </div>
            <button type="button" onClick={handleTest} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium text-text hover:bg-canvas">
              <Plug size={15} /> Tes koneksi
            </button>
            {test.status !== 'idle' && <p className={`text-sm ${toneCls[test.status]}`}>{test.msg}</p>}
            <div className="rounded-lg bg-canvas p-3 text-xs text-muted">
              <p className="mb-1 font-semibold text-text">Penting: izinkan CORS di Ollama</p>
              <p>Browser memblokir akses ke Ollama dari alamat lain kecuali diizinkan. Jalankan Ollama dengan:</p>
              <pre className="mt-1 overflow-x-auto rounded bg-surface p-2 font-mono">OLLAMA_ORIGINS=http://localhost:5173 ollama serve</pre>
              <p className="mt-1">Windows: set variabel lingkungan <code>OLLAMA_ORIGINS</code>, lalu restart Ollama. Mac (app): <code>launchctl setenv OLLAMA_ORIGINS "http://localhost:5173"</code>, lalu restart.</p>
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Anthropic API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus-ring"
            />
            <p className="mt-1 text-xs text-muted">Disimpan hanya di browser ini dan dikirim langsung ke api.anthropic.com.</p>
          </div>
        )}

        <button type="submit" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          {saved && <Check size={16} />} {saved ? 'Tersimpan' : 'Simpan Pengaturan'}
        </button>
      </form>
    </AppShell>
  )
}
