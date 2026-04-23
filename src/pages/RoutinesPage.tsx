import { useState } from "react"
import { useApp } from "@/src/context/AppContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, RotateCcw, Clock, Sun, Moon, Sunrise } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RoutinesPage() {
  const { routines, addRoutine, toggleRoutine, updateRoutine, deleteRoutine, resetDailyRoutines } = useApp()
  const [newTitle, setNewTitle] = useState("")
  const [newTime, setNewTime] = useState("08:00")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editTime, setEditTime] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleAddRoutine = () => {
    if (newTitle.trim()) {
      addRoutine(newTitle.trim(), newTime)
      setNewTitle("")
      setNewTime("08:00")
      setIsDialogOpen(false)
    }
  }

  const handleEditRoutine = (id: string, title: string, time: string) => {
    setEditingId(id)
    setEditTitle(title)
    setEditTime(time)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateRoutine(editingId, editTitle.trim(), editTime)
    }
    setEditingId(null)
    setEditTitle("")
    setEditTime("")
    setIsEditDialogOpen(false)
  }

  const completedCount = routines.filter((r) => r.completed).length
  
  // Group routines by time of day
  const getTimeOfDay = (time: string) => {
    const hour = parseInt(time.split(":")[0])
    if (hour < 12) return "morning"
    if (hour < 17) return "afternoon"
    return "evening"
  }

  const morningRoutines = routines.filter((r) => getTimeOfDay(r.time) === "morning")
  const afternoonRoutines = routines.filter((r) => getTimeOfDay(r.time) === "afternoon")
  const eveningRoutines = routines.filter((r) => getTimeOfDay(r.time) === "evening")

  const TimeIcon = ({ time }: { time: string }) => {
    const period = getTimeOfDay(time)
    if (period === "morning") return <Sunrise className="w-4 h-4 text-chart-3" />
    if (period === "afternoon") return <Sun className="w-4 h-4 text-chart-3" />
    return <Moon className="w-4 h-4 text-chart-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Daily Routines</h1>
          <p className="text-muted-foreground mt-1">
            {completedCount} of {routines.length} completed today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetDailyRoutines} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Day
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Routine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Routine</DialogTitle>
                <DialogDescription>Create a daily routine with a scheduled time.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Routine Name</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Morning meditation"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Scheduled Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRoutine}>Add Routine</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress */}
      <Card className="bg-gradient-to-r from-chart-2/10 to-chart-1/10 border-chart-2/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
              <Clock className="w-6 h-6 text-chart-2" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Progress</span>
                <span className="text-sm text-muted-foreground">
                  {routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-chart-2 to-chart-1 transition-all duration-300"
                  style={{
                    width: routines.length > 0 ? `${(completedCount / routines.length) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routine Sections */}
      {[
        { title: "Morning", icon: Sunrise, routines: morningRoutines, color: "text-chart-3" },
        { title: "Afternoon", icon: Sun, routines: afternoonRoutines, color: "text-chart-3" },
        { title: "Evening", icon: Moon, routines: eveningRoutines, color: "text-chart-4" },
      ].map(
        (section) =>
          section.routines.length > 0 && (
            <Card key={section.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <section.icon className={cn("w-5 h-5", section.color)} />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <CardDescription>
                  {section.routines.filter((r) => r.completed).length} of {section.routines.length} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.routines.map((routine) => (
                    <div
                      key={routine.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                        routine.completed
                          ? "bg-chart-2/10"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <Checkbox
                        checked={routine.completed}
                        onCheckedChange={() => toggleRoutine(routine.id)}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "text-sm font-medium block truncate",
                            routine.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {routine.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TimeIcon time={routine.time} />
                        <span className="text-xs">{routine.time}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditRoutine(routine.id, routine.title, routine.time)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteRoutine(routine.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
      )}

      {routines.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No routines yet. Add your first daily routine!</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Routine</DialogTitle>
            <DialogDescription>Update your routine details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Routine Name</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">Scheduled Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
