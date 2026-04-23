import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/src/lib/api"

// Types
export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

export interface Routine {
  id: string
  title: string
  completed: boolean
  time: string
  lastReset: Date
}

export interface Event {
  id: string
  title: string
  date: Date
  description: string
  finished: boolean
}

export interface Note {
  id: string
  title: string
  link?: string
  content: string
  createdAt: Date
}

interface AppState {
  todos: Todo[]
  routines: Routine[]
  events: Event[]
  notes: Note[]
  sidebarCollapsed: boolean
  loading: boolean
}

interface AppContextType extends AppState {
  addTodo: (title: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  updateTodo: (id: string, title: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>

  addRoutine: (title: string, time: string) => Promise<void>
  toggleRoutine: (id: string) => Promise<void>
  updateRoutine: (id: string, title: string, time: string) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>
  resetDailyRoutines: () => Promise<void>

  addEvent: (title: string, date: Date, description: string) => Promise<void>
  toggleEventFinished: (id: string) => Promise<void>
  updateEvent: (id: string, title: string, date: Date, description: string) => Promise<void>
  deleteEvent: (id: string) => Promise<void>

  addNote: (title: string, content: string, link?: string) => Promise<void>
  updateNote: (id: string, title: string, content: string, link?: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  toggleSidebar: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const toDate = (v: string | Date) => (v instanceof Date ? v : new Date(v))
const hydrateTodo = (t: any): Todo => ({ ...t, createdAt: toDate(t.createdAt) })
const hydrateRoutine = (r: any): Routine => ({ ...r, lastReset: toDate(r.lastReset) })
const hydrateEvent = (e: any): Event => ({ ...e, date: toDate(e.date) })
const hydrateNote = (n: any): Note => ({ ...n, createdAt: toDate(n.createdAt) })

export function AppProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [t, r, e, n] = await Promise.all([
          api.get<any[]>("/todos"),
          api.get<any[]>("/routines"),
          api.get<any[]>("/events"),
          api.get<any[]>("/notes"),
        ])
        if (cancelled) return
        setTodos(t.map(hydrateTodo))
        setRoutines(r.map(hydrateRoutine))
        setEvents(e.map(hydrateEvent))
        setNotes(n.map(hydrateNote))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Todos
  const addTodo = async (title: string) => {
    const created = await api.post<any>("/todos", { title })
    setTodos((prev) => [...prev, hydrateTodo(created)])
  }
  const toggleTodo = async (id: string) => {
    const current = todos.find((t) => t.id === id)
    if (!current) return
    const updated = await api.patch<any>(`/todos/${id}`, { completed: !current.completed })
    setTodos((prev) => prev.map((t) => (t.id === id ? hydrateTodo(updated) : t)))
  }
  const updateTodo = async (id: string, title: string) => {
    const updated = await api.patch<any>(`/todos/${id}`, { title })
    setTodos((prev) => prev.map((t) => (t.id === id ? hydrateTodo(updated) : t)))
  }
  const deleteTodo = async (id: string) => {
    await api.delete(`/todos/${id}`)
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  // Routines
  const addRoutine = async (title: string, time: string) => {
    const created = await api.post<any>("/routines", { title, time })
    setRoutines((prev) => [...prev, hydrateRoutine(created)])
  }
  const toggleRoutine = async (id: string) => {
    const current = routines.find((r) => r.id === id)
    if (!current) return
    const updated = await api.patch<any>(`/routines/${id}`, { completed: !current.completed })
    setRoutines((prev) => prev.map((r) => (r.id === id ? hydrateRoutine(updated) : r)))
  }
  const updateRoutine = async (id: string, title: string, time: string) => {
    const updated = await api.patch<any>(`/routines/${id}`, { title, time })
    setRoutines((prev) => prev.map((r) => (r.id === id ? hydrateRoutine(updated) : r)))
  }
  const deleteRoutine = async (id: string) => {
    await api.delete(`/routines/${id}`)
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }
  const resetDailyRoutines = async () => {
    const fresh = await api.post<any[]>("/routines/reset")
    setRoutines(fresh.map(hydrateRoutine))
  }

  // Events
  const addEvent = async (title: string, date: Date, description: string) => {
    const created = await api.post<any>("/events", {
      title,
      date: date.toISOString(),
      description,
    })
    setEvents((prev) => [...prev, hydrateEvent(created)])
  }
  const toggleEventFinished = async (id: string) => {
    const current = events.find((e) => e.id === id)
    if (!current) return
    const updated = await api.patch<any>(`/events/${id}`, { finished: !current.finished })
    setEvents((prev) => prev.map((e) => (e.id === id ? hydrateEvent(updated) : e)))
  }
  const updateEvent = async (id: string, title: string, date: Date, description: string) => {
    const updated = await api.patch<any>(`/events/${id}`, {
      title,
      date: date.toISOString(),
      description,
    })
    setEvents((prev) => prev.map((e) => (e.id === id ? hydrateEvent(updated) : e)))
  }
  const deleteEvent = async (id: string) => {
    await api.delete(`/events/${id}`)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  // Notes
  const addNote = async (title: string, content: string, link?: string) => {
    const created = await api.post<any>("/notes", { title, content, link })
    setNotes((prev) => [hydrateNote(created), ...prev])
  }
  const updateNote = async (id: string, title: string, content: string, link?: string) => {
    const updated = await api.patch<any>(`/notes/${id}`, { title, content, link })
    setNotes((prev) => prev.map((n) => (n.id === id ? hydrateNote(updated) : n)))
  }
  const deleteNote = async (id: string) => {
    await api.delete(`/notes/${id}`)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)

  return (
    <AppContext.Provider
      value={{
        todos,
        routines,
        events,
        notes,
        sidebarCollapsed,
        loading,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        addRoutine,
        toggleRoutine,
        updateRoutine,
        deleteRoutine,
        resetDailyRoutines,
        addEvent,
        toggleEventFinished,
        updateEvent,
        deleteEvent,
        addNote,
        updateNote,
        deleteNote,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
