import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QuizDataProvider } from './context/QuizDataContext'
import Dashboard from './pages/Dashboard'
import QuestionBank from './pages/QuestionBank'
import PassingGrade from './pages/PassingGrade'
import ImportExport from './pages/ImportExport'
import History from './pages/History'
import Settings from './pages/Settings'
import PracticeFlow from './pages/PracticeFlow'
import ExamFlow from './pages/ExamFlow'

export default function App() {
  return (
    <QuizDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/soal" element={<QuestionBank />} />
          <Route path="/passing-grade" element={<PassingGrade />} />
          <Route path="/impor-ekspor" element={<ImportExport />} />
          <Route path="/latihan" element={<PracticeFlow />} />
          <Route path="/ujian" element={<ExamFlow />} />
          <Route path="/riwayat" element={<History />} />
          <Route path="/pengaturan" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </QuizDataProvider>
  )
}
