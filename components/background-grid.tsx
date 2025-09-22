"use client"

import type React from "react"
import { useEffect, useState } from "react"

type Spot = {
  id: number
  x: number // vw
  y: number // vh
  size: number
  hue: "red" | "violet" | "yellow"
  visible: boolean
  opacity: number
}

const COLORS = {
  red: "168, 0, 42",        // Deep crimson
  violet: "138, 60, 230",   // Royal violet
  yellow: "255, 180, 0",    // Warm gold
}

export default function BackgroundGrid() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [isDark, setIsDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    const checkMobile = () => {
      try {
        setIsMobile(window.matchMedia("(max-width: 640px)").matches)
      } catch {}
    }
    const checkReducedMotion = () => {
      try {
        setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      } catch {}
    }

    checkDark()
    checkMobile()
    checkReducedMotion()

    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributeFilter: ["class"] })

    window.addEventListener("resize", checkMobile)
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    rmQuery.addEventListener?.("change", checkReducedMotion)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", checkMobile)
      rmQuery.removeEventListener?.("change", checkReducedMotion)
    }
  }, [])

  useEffect(() => {
    // Reduced spot count for less visual noise
    const intensity = prefersReducedMotion ? 0.2 : isMobile ? 0.3 : 0.5
    const count = Math.max(2, Math.round(5 * intensity))
    const baseSize = 100 * intensity + (isMobile ? 40 : 100)

    const seeded: Spot[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: baseSize + Math.random() * (120 * intensity),
      hue: isDark ? "red" : Math.random() > 0.5 ? "violet" : "yellow",
      visible: false,
      opacity: 0,
    }))
    setSpots(seeded)

    // Slower, more controlled animations
    const intervalMs = prefersReducedMotion ? 6000 : isMobile ? 5000 : 4000
    const movement = prefersReducedMotion ? 0.3 : isMobile ? 0.5 : 1
    const toggleChance = prefersReducedMotion ? 0.1 : isMobile ? 0.2 : 0.3

    const id = setInterval(() => {
      setSpots((prev) =>
        prev.map((s) => {
          const newHue = isDark
            ? "red"
            : Math.random() > 0.5
              ? "violet"
              : "yellow"

          // Smooth, constrained movement
          const newX = Math.max(10, Math.min(90, s.x + (Math.random() * movement - movement / 2)))
          const newY = Math.max(10, Math.min(90, s.y + (Math.random() * movement - movement / 2)))

          // Controlled visibility changes
          const shouldToggle = Math.random() < toggleChance
          const newVisible = shouldToggle ? !s.visible : s.visible

          return {
            ...s,
            x: newX,
            y: newY,
            hue: newHue,
            visible: newVisible,
          }
        }),
      )
    }, intervalMs)

    return () => clearInterval(id)
  }, [isDark, isMobile, prefersReducedMotion])

  // Handle smooth, consistent opacity transitions
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setSpots(prev => 
        prev.map(spot => {
          const maxOpacity = isDark ? 0.3 : 0.25
          const targetOpacity = spot.visible ? maxOpacity : 0
          let newOpacity = spot.opacity
          
          // Very slow transitions to prevent blinking
          const transitionSpeed = 0.005

          if (spot.opacity < targetOpacity) {
            newOpacity = Math.min(spot.opacity + transitionSpeed, targetOpacity)
          } else if (spot.opacity > targetOpacity) {
            newOpacity = Math.max(spot.opacity - transitionSpeed, targetOpacity)
          }
          
          return {
            ...spot,
            opacity: newOpacity
          }
        })
      )
    }, 30) // Consistent frame rate

    return () => clearInterval(transitionInterval)
  }, [isDark])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 w-screen h-screen -z-10">
      {/* Enhanced Grid */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
        }}
      />

      {/* Softer glow spots with smooth transitions */}
      {spots.map((s) => {
        const rgb = COLORS[s.hue]
        const style: React.CSSProperties = {
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          transform: "translate(-50%, -50%)",
          background: `
            radial-gradient(
              circle closest-side,
              rgba(${rgb}, ${s.opacity * 0.7}),
              rgba(${rgb}, ${s.opacity * 0.4}) 50%,
              rgba(${rgb}, ${s.opacity * 0.2}) 70%,
              transparent 85%
            )
          `,
          boxShadow: `0 0 ${Math.max(8, s.size / 8)}px rgba(${rgb}, ${s.opacity * 0.2})`,
          opacity: s.opacity,
        }

        return (
          <div
            key={s.id}
            className={`absolute rounded-full blur-2xl transition-all duration-1000 ease-out`}
            style={style}
          />
        )
      })}
    </div>
  )
}