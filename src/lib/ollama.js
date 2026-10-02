// Calls a locally running Ollama server (default http://localhost:11434).
// Nothing leaves your computer: the browser talks straight to your Ollama.
function buildPrompt(question) {
  const optionLines = question.opts
    .map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`)
    .join(', ')
  return `Soal tes ASN kategori ${question.cat}: "${question.q}"
Pilihan: ${optionLines}
Jawaban benar: ${String.fromCharCode(65 + question.correct)}. ${question.opts[question.correct]}
Jelaskan singkat (maksimal 3 kalimat) dalam Bahasa Indonesia mengapa jawaban itu benar.`
}

const clean = (url) => url.replace(/\/+$/, '')

export async function explainAnswerOllama({ baseUrl, model, question }) {
  const res = await fetch(`${clean(baseUrl)}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: 'user', content: buildPrompt(question) }],
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`OLLAMA_ERROR_${res.status}: ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return data?.message?.content?.trim() || 'Tidak ada penjelasan yang dikembalikan.'
}

// Returns the list of model names installed in Ollama (used by "Tes koneksi").
export async function listOllamaModels(baseUrl) {
  const res = await fetch(`${clean(baseUrl)}/api/tags`)
  if (!res.ok) throw new Error(`OLLAMA_ERROR_${res.status}`)
  const data = await res.json()
  return (data.models || []).map((m) => m.name)
}
