import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import TodosPage from './pages/TodosPage'
import RoutinesPage from './pages/RoutinesPage'
import EventsPage from './pages/EventsPage'
import NotesPage from './pages/NotesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="routines" element={<RoutinesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="notes" element={<NotesPage />} />
      </Route>
    </Routes>
  )
}

export default App
