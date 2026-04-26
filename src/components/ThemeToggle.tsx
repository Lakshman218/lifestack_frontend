import { Moon, Sun, Monitor, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useTheme, type Theme } from "@/src/context/ThemeContext"

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
]

export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme()
  const Active = options.find((o) => o.value === theme)?.Icon ?? Monitor

  const Trigger = collapsed ? (
    <button
      type="button"
      className="flex items-center justify-center p-2.5 w-full rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
    >
      <Active className="w-5 h-5" />
      <span className="sr-only">Theme</span>
    </button>
  ) : (
    <button
      type="button"
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
    >
      <Active className="w-5 h-5" />
      <span className="font-medium">Theme</span>
    </button>
  )

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{Trigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Theme</TooltipContent>
        </Tooltip>
      ) : (
        <DropdownMenuTrigger asChild>{Trigger}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent align="start" side={collapsed ? "right" : "top"} className="w-40">
        {options.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1">{label}</span>
            <Check className={cn("w-4 h-4", theme === value ? "opacity-100" : "opacity-0")} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
