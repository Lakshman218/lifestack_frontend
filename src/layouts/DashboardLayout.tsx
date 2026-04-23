import { Navigate, Outlet } from "react-router-dom"
import { AppProvider, useApp } from "@/src/context/AppContext"
import { Sidebar } from "@/src/components/Sidebar"
import { api } from "@/src/lib/api"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useEffect, useState } from "react"

function DashboardContent() {
  const { sidebarCollapsed } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar />
            </SheetContent>
          </Sheet>
          <span className="text-lg font-semibold">Lifestack</span>
          <div className="w-10" />
        </div>
      </div>

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        )}
      >
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default function DashboardLayout() {
  const [status, setStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking")

  useEffect(() => {
    let cancelled = false
    api
      .get("/auth/me")
      .then(() => {
        if (!cancelled) setStatus("authenticated")
      })
      .catch(() => {
        if (!cancelled) setStatus("unauthenticated")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />
  }

  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  )
}
