import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadData, saveData } from '../lib/storage'

const QuizDataContext = createContext(null)

export function QuizDataProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => { saveData(data) }, [data])

  const categories = useMemo(
    () => [...new Set(data.questions.map((q) => q.cat || 'Umum'))],
    [data.questions]
  )

  function ensurePassingGrade(cat) {
    setData((d) => (d.passingGrade[cat] !== undefined ? d : {
      ...d, passingGrade: { ...d.passingGrade, [cat]: 60 },
    }))
  }

  function addQuestion(payload) {
    setData((d) => {
      const nextId = d.questions.length ? Math.max(...d.questions.map((q) => q.id)) + 1 : 1
      const pg = d.passingGrade[payload.cat] !== undefined
        ? d.passingGrade
        : { ...d.passingGrade, [payload.cat]: 60 }
      return { ...d, questions: [...d.questions, { id: nextId, ...payload }], passingGrade: pg }
    })
  }

  function updateQuestion(id, payload) {
    setData((d) => ({
      ...d,
      questions: d.questions.map((q) => (q.id === id ? { ...q, ...payload } : q)),
      passingGrade: d.passingGrade[payload.cat] !== undefined
        ? d.passingGrade
        : { ...d.passingGrade, [payload.cat]: 60 },
    }))
  }

  function deleteQuestion(id) {
    setData((d) => ({ ...d, questions: d.questions.filter((q) => q.id !== id) }))
  }

  function setPassingGrade(cat, value) {
    setData((d) => ({ ...d, passingGrade: { ...d.passingGrade, [cat]: value } }))
  }

  function importQuestions(incoming, passingGrade, mode) {
    setData((d) => {
      let nextId = d.questions.length ? Math.max(...d.questions.map((q) => q.id)) + 1 : 1
      const normalized = incoming.map((q) => ({
        id: nextId++,
        cat: q.cat || 'Umum',
        q: q.q,
        opts: q.opts,
        correct: q.correct,
        difficulty: q.difficulty || 'Sedang',
      }))
      const questions = mode === 'replace' ? normalized : [...d.questions, ...normalized]
      const mergedPG = passingGrade ? { ...d.passingGrade, ...passingGrade } : d.passingGrade
      return { ...d, questions, passingGrade: mergedPG }
    })
  }

  function recordSession({ mode, correct, total, summary, wrongIds, fixedIds }) {
    setData((d) => {
      const pct = total ? Math.round((correct / total) * 100) : 0
      let nextWrong = wrongIds && wrongIds.length
        ? [...new Set([...d.wrongIds, ...wrongIds])]
        : d.wrongIds
      if (fixedIds && fixedIds.length) {
        nextWrong = nextWrong.filter((id) => !fixedIds.includes(id))
      }
      return {
        ...d,
        best: Math.max(d.best, pct),
        totalTaken: d.totalTaken + 1,
        history: [...d.history, { date: new Date().toLocaleDateString('id-ID'), mode, summary }],
        wrongIds: nextWrong,
      }
    })
  }

  function clearWrongIds(ids) {
    setData((d) => ({ ...d, wrongIds: d.wrongIds.filter((id) => !ids.includes(id)) }))
  }

  const value = {
    ...data,
    categories,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setPassingGrade,
    ensurePassingGrade,
    importQuestions,
    recordSession,
    clearWrongIds,
    setData,
  }

  return <QuizDataContext.Provider value={value}>{children}</QuizDataContext.Provider>
}

export function useQuizData() {
  const ctx = useContext(QuizDataContext)
  if (!ctx) throw new Error('useQuizData must be used within QuizDataProvider')
  return ctx
}
