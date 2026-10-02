// Calls the Anthropic Messages API directly from the browser using the
// user's own API key. Requires the "anthropic-dangerous-direct-browser-access"
// header, which Anthropic documents for exactly this client-side use case.
// The key is stored only in the user's browser (localStorage) and is sent
// straight to api.anthropic.com — it never passes through any other server.
export async function explainAnswer({ apiKey, question }) {
  if (!apiKey) throw new Error('NO_KEY')

  const optionLines = question.opts
    .map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`)
    .join(', ')

  const prompt = `Soal tes ASN kategori ${question.cat}: "${question.q}"
Pilihan: ${optionLines}
Jawaban benar: ${String.fromCharCode(65 + question.correct)}. ${question.opts[question.correct]}
Jelaskan singkat (maksimal 3 kalimat) dalam Bahasa Indonesia mengapa jawaban itu benar.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API_ERROR_${res.status}: ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  const textBlock = (data.content || []).find((b) => b.type === 'text')
  return textBlock ? textBlock.text : 'Tidak ada penjelasan yang dikembalikan.'
}
