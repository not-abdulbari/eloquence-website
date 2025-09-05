"use client"

import { useEffect, useState } from "react"

export default function BlurBubbles() {
  const [isDark, setIsDark] = useState(false)

  // Detect dark mode via document class
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* === Dark Mode: Royal Red Embers === */}
      {isDark ? (
        <>
          {/* Deep red neon glow orb (left) - reduced opacity */}
          <div className="absolute left-[15%] top-[25%] h-40 w-40 rounded-full 
                         bg-[#b8002a]/20 blur-3xl mix-blend-screen opacity-50 
                         animate-pulse-slow" />

          {/* Central ember glow - reduced size and opacity */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 
                         rounded-full bg-[#a60020]/15 blur-2xl opacity-30 
                         animate-pulse-faint" />

          {/* Bottom right: faint white mist - reduced size and opacity */}
          <div className="absolute right-[25%] bottom-[20%] h-48 w-48 rounded-full 
                         bg-white/4 blur-3xl mix-blend-overlay opacity-25 
                         animate-pulse-very-faint" />
        </>
      ) : (
        <>
          {/* === Light Mode: Violet & Gold Elegance === */}

          {/* Soft violet glow (left) - reduced opacity */}
          <div className="absolute left-[15%] top-[25%] h-40 w-40 rounded-full 
                         bg-[#8a3eb6]/10 blur-3xl mix-blend-screen opacity-30 
                         animate-pulse-slow" />

          {/* Central soft violet - reduced size and opacity */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 
                         rounded-full bg-[#9d5df0]/10 blur-2xl opacity-25 
                         animate-pulse-faint" />

          {/* Bottom right: soft violet ambient - reduced size and opacity */}
          <div className="absolute right-[25%] bottom-[20%] h-48 w-48 rounded-full 
                         bg-[#7a44d8]/8 blur-3xl mix-blend-overlay opacity-20 
                         animate-pulse-very-faint" />
        </>
      )}
    </div>
  )
}