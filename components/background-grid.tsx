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
  targetOpacity: number
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
    const intensity = prefersReducedMotion ? 0.2 : isMobile ? 0.3 : 0.5
    const count = Math.max(4, Math.round(10 * intensity))
    const baseSize = 80 * intensity + (isMobile ? 30 : 60)

    const seeded: Spot[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: baseSize + Math.random() * (80 * intensity),
      hue: isDark ? "red" : Math.random() > 0.5 ? "violet" : "yellow",
      visible: true,
      opacity: 0,
      // Reduced target opacity by 50%
      targetOpacity: Math.random() * 0.2 + 0.2, // Was 0.4 + 0.4
    }))
    setSpots(seeded)

    const movement = prefersReducedMotion ? 0.3 : isMobile ? 0.5 : 0.8
    const intervalMs = prefersReducedMotion ? 6000 : isMobile ? 5000 : 4000

    const id = setInterval(() => {
      setSpots((prev) =>
        prev.map((s) => {
          const newX = Math.max(10, Math.min(90, s.x + (Math.random() * movement - movement / 2)))
          const newY = Math.max(10, Math.min(90, s.y + (Math.random() * movement - movement / 2)))
          // Reduced target opacity by 50%
          const newTargetOpacity = Math.random() * 0.2 + 0.2 // Was 0.4 + 0.4
          const newHue = isDark
            ? "red"
            : Math.random() > 0.9
              ? (Math.random() > 0.5 ? "violet" : "yellow")
              : s.hue

          return {
            ...s,
            x: newX,
            y: newY,
            hue: newHue,
            targetOpacity: newTargetOpacity,
          }
        }),
      )
    }, intervalMs)

    return () => clearInterval(id)
  }, [isDark, isMobile, prefersReducedMotion])

  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setSpots(prev => 
        prev.map(spot => {
          let newOpacity = spot.opacity
          const transitionSpeed = 0.008

          if (spot.opacity < spot.targetOpacity) {
            newOpacity = Math.min(spot.opacity + transitionSpeed, spot.targetOpacity)
          } else if (spot.opacity > spot.targetOpacity) {
            newOpacity = Math.max(spot.opacity - transitionSpeed, spot.targetOpacity)
          }
          
          return {
            ...spot,
            opacity: newOpacity
          }
        })
      )
    }, 30)

    return () => clearInterval(transitionInterval)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 w-screen h-screen -z-10">
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

      {spots.map((s) => {
        const rgb = COLORS[s.hue]
        const style: React.CSSProperties = {
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          transform: "translate(-50%, -50%)",
          // Reduced gradient opacity by 50%
          background: `
            radial-gradient(
              circle closest-side,
              rgba(${rgb}, ${s.opacity}),
              rgba(${rgb}, ${s.opacity * 0.3}) 50%, 
              rgba(${rgb}, ${s.opacity * 0.15}) 70%,
              transparent 80%
            )
          `,
          // Reduced shadow opacity by 50%
          boxShadow: `0 0 ${Math.max(12, s.size / 6)}px rgba(${rgb}, ${s.opacity * 0.35})`,
          opacity: s.opacity,
        }

        return (
          <div
            key={s.id}
            className={`absolute rounded-full blur-xl transition-all duration-1000 ease-out`}
            style={style}
          />
        )
      })}
    </div>
  )
}