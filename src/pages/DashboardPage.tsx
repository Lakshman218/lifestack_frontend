import { Link } from "react-router-dom"
import { useApp } from "@/src/context/AppContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, Calendar, FileText, ArrowRight, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { todos, routines, events, notes } = useApp()

  const completedTodos = todos.filter((t) => t.completed).length
  const completedRoutines = routines.filter((r) => r.completed).length
  const upcomingEvents = events.filter((e) => !e.finished && new Date(e.date) >= new Date()).length

  const stats = [
    {
      title: "Tasks",
      value: `${completedTodos}/${todos.length}`,
      description: "completed today",
      icon: CheckSquare,
      to: "/dashboard/todos",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Routines",
      value: `${completedRoutines}/${routines.length}`,
      description: "done for today",
      icon: Clock,
      to: "/dashboard/routines",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Events",
      value: upcomingEvents.toString(),
      description: "upcoming",
      icon: Calendar,
      to: "/dashboard/events",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Notes",
      value: notes.length.toString(),
      description: "quick notes",
      icon: FileText,
      to: "/dashboard/notes",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  const recentTodos = todos.slice(0, 4)
  const todayRoutines = routines.slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your productivity overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.to}>
            <Card className="hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Tasks</CardTitle>
              <CardDescription>Your latest todo items</CardDescription>
            </div>
            <Link
              to="/dashboard/todos"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTodos.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">No tasks yet</p>
              ) : (
                recentTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-chart-2 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        todo.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {todo.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Routines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Today&apos;s Routines</CardTitle>
              <CardDescription>Daily habits to complete</CardDescription>
            </div>
            <Link
              to="/dashboard/routines"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayRoutines.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">No routines yet</p>
              ) : (
                todayRoutines.map((routine) => (
                  <div
                    key={routine.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {routine.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-chart-2 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm font-medium",
                          routine.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {routine.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{routine.time}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Access</CardTitle>
          <CardDescription>Jump to any section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all group"
              >
                <div className={cn("p-2 rounded-lg", item.bgColor)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
