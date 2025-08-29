"use client"

import { Clapperboard, Code2, Gamepad2, Globe, HelpCircle, Utensils, FileText } from "lucide-react"

type FloatingIconsProps = {
  // 'hero' confines icons to the top band of the hero so they won't appear near other sections
  variant?: "full" | "hero"
}

export default function FloatingIcons({ variant = "hero" }: FloatingIconsProps) {
  const container =
    variant === "hero"
      ? "pointer-events-none absolute left-0 right-0 top-0 h-[280px] overflow-hidden -z-10"
      : "pointer-events-none absolute inset-0 overflow-hidden -z-10"

  return (
    <div aria-hidden="true" className={container}>
      {/* coding - top left */}
      <div className="absolute left-6 top-10 animate-float opacity-80">
        <Code2 className="h-6 w-6 text-[#ff7a00]" style={{ filter: "drop-shadow(0 0 14px rgba(255,122,0,0.65))" }} />
      </div>

      {/* website - mid left */}
      <div className="absolute left-20 top-32 animate-float-delayed opacity-75">
        <Globe className="h-7 w-7 text-[#b44cff]" style={{ filter: "drop-shadow(0 0 14px rgba(180,76,255,0.6))" }} />
      </div>

      {/* quiz - top right */}
      <div className="absolute right-8 top-8 animate-float-slow opacity-80">
        <HelpCircle
          className="h-6 w-6 text-[#ff7a00]"
          style={{ filter: "drop-shadow(0 0 14px rgba(255,122,0,0.65))" }}
        />
      </div>

      {/* paper presentation - mid right */}
      <div className="absolute right-24 top-40 animate-float opacity-75">
        <FileText className="h-7 w-7 text-[#b44cff]" style={{ filter: "drop-shadow(0 0 14px rgba(180,76,255,0.6))" }} />
      </div>

      {/* cooking - bottom left of hero band */}
      <div className="absolute bottom-2 left-10 animate-float-slow opacity-70">
        <Utensils className="h-7 w-7 text-[#ff7a00]" style={{ filter: "drop-shadow(0 0 14px rgba(255,122,0,0.6))" }} />
      </div>

      {/* filming - bottom center */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-float-delayed opacity-70">
        <Clapperboard
          className="h-7 w-7 text-[#b44cff]"
          style={{ filter: "drop-shadow(0 0 14px rgba(180,76,255,0.6))" }}
        />
      </div>

      {/* gaming - bottom right */}
      <div className="absolute bottom-3 right-12 animate-float opacity-70">
        <Gamepad2 className="h-7 w-7 text-[#ff7a00]" style={{ filter: "drop-shadow(0 0 14px rgba(255,122,0,0.6))" }} />
      </div>
    </div>
  )
}
