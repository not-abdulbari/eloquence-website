import { Clapperboard, Code2, Gamepad, Globe, HelpCircle, Utensils, FileText } from "lucide-react"

export default function EventsIconsStrip() {
  const items = [
    { Icon: Code2, label: "Coding" },
    { Icon: FileText, label: "Paper Presentation" },
    { Icon: Globe, label: "Website" },
    { Icon: HelpCircle, label: "Quiz" },
    { Icon: Utensils, label: "Cooking" },
    { Icon: Clapperboard, label: "Filming" },
    { Icon: Gamepad, label: "Gaming" },
  ]
  return (
    <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
      {items.map(({ Icon, label }) => (
        <div
          key={label}
          aria-label={label}
          className="flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs text-muted-foreground backdrop-blur transition-colors hover:bg-primary/10 hover:text-foreground focus-within:ring-2 focus-within:ring-primary/35"
        >
          <Icon className="h-4 w-4 text-primary drop-shadow-glow" />
          <span className="hidden sm:inline">{label}</span>
        </div>
      ))}
    </div>
  )
}
