const KEY = 'asn_admin_data_v1'
const API_KEY_STORAGE = 'asn_admin_anthropic_key'
const PROVIDER_STORAGE = 'asn_admin_ai_provider'
const OLLAMA_STORAGE = 'asn_admin_ollama_config'

export const DEFAULT_PASSING_GRADE = { TWK: 65, TIU: 80, TKP: 166 }

const SEED_QUESTIONS = [
  { id: 1, cat: 'TWK', q: 'Pancasila sebagai dasar negara pertama kali disahkan pada tanggal?', opts: ['1 Juni 1945', '17 Agustus 1945', '18 Agustus 1945', '22 Juni 1945'], correct: 2, difficulty: 'Sedang' },
  { id: 2, cat: 'TIU', q: '8, 11, 15, 20, 26, ... angka selanjutnya adalah?', opts: ['30', '32', '33', '31'], correct: 2, difficulty: 'Sedang' },
  { id: 3, cat: 'TIU', q: 'Jika semua A adalah B, dan sebagian B adalah C, maka?', opts: ['Semua A adalah C', 'Sebagian A mungkin C', 'Semua C adalah A', 'Tidak ada A yang C'], correct: 1, difficulty: 'Sulit' },
  { id: 4, cat: 'TKP', q: 'Sikap yang mencerminkan nilai integritas ASN adalah?', opts: ['Menerima gratifikasi kecil', 'Jujur meski tidak diawasi', 'Ikut arus rekan kerja', 'Diam saat melihat kecurangan'], correct: 1, difficulty: 'Mudah' },
  { id: 5, cat: 'TWK', q: 'Lembaga yang berwenang mengubah UUD 1945 adalah?', opts: ['DPR', 'MPR', 'MA', 'KY'], correct: 1, difficulty: 'Mudah' },
]

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { history: [], best: 0, totalTaken: 0, passingGrade: { ...DEFAULT_PASSING_GRADE }, wrongIds: [], ...parsed }
    }
  } catch (e) { /* ignore corrupt storage */ }
  return {
    questions: SEED_QUESTIONS,
    best: 0,
    totalTaken: 0,
    history: [],
    passingGrade: { ...DEFAULT_PASSING_GRADE },
    wrongIds: [],
  }
}

export function saveData(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch (e) { /* storage full or unavailable */ }
}

export function getApiKey() {
  try { return localStorage.getItem(API_KEY_STORAGE) || '' } catch (e) { return '' }
}
export function setApiKey(key) {
  try { localStorage.setItem(API_KEY_STORAGE, key) } catch (e) { /* ignore */ }
}

// 'anthropic' | 'ollama'
export function getAiProvider() {
  try { return localStorage.getItem(PROVIDER_STORAGE) || 'ollama' } catch (e) { return 'ollama' }
}
export function setAiProvider(provider) {
  try { localStorage.setItem(PROVIDER_STORAGE, provider) } catch (e) { /* ignore */ }
}

const DEFAULT_OLLAMA = { baseUrl: 'http://localhost:11434', model: 'llama3.1:8b' }
export function getOllamaConfig() {
  try {
    const raw = localStorage.getItem(OLLAMA_STORAGE)
    return raw ? { ...DEFAULT_OLLAMA, ...JSON.parse(raw) } : { ...DEFAULT_OLLAMA }
  } catch (e) { return { ...DEFAULT_OLLAMA } }
}
export function setOllamaConfig(config) {
  try { localStorage.setItem(OLLAMA_STORAGE, JSON.stringify(config)) } catch (e) { /* ignore */ }
}
