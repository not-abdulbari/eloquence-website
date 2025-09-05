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
}

const COLORS = {
  red: "168, 0, 42",        // Deep crimson
  violet: "138, 60, 230",   // Royal violet
  yellow: "255, 180, 0",    // Warm gold
}

export default function BackgroundGrid() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkDark()

    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Reduced from 10 to 5 bubbles
    const seeded: Spot[] = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 120 + Math.random() * 160,
      hue: isDark ? "red" : Math.random() > 0.5 ? "violet" : "yellow",
      visible: Math.random() > 0.6,
    }))
    setSpots(seeded)

    const id = setInterval(() => {
      setSpots((prev) =>
        prev.map((s) => {
          if (Math.random() < 0.3) {
            const newHue = isDark
              ? "red"
              : Math.random() > 0.5
                ? "violet"
                : "yellow"

            return {
              ...s,
              visible: !s.visible,
              x: (s.x + (Math.random() * 10 - 5) + 100) % 100,
              y: (s.y + (Math.random() * 10 - 5) + 100) % 100,
              hue: newHue,
            }
          }
          return s
        }),
      )
    }, 1800)

    return () => clearInterval(id)
  }, [isDark])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 w-screen h-screen -z-10">
      {/* 🔁 Enhanced Grid – Visible in Both Modes */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          // Grid pattern: solid black/white lines
          backgroundImage: isDark
            ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "center center",
        }}
      />

      {/* Neon Glow Spots (unchanged) */}
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
              rgba(${rgb}, ${isDark ? 0.8 : 0.6}),
              rgba(${rgb}, ${isDark ? 0.4 : 0.3}) 50%,
              rgba(${rgb}, ${isDark ? 0.15 : 0.1}) 70%,
              transparent 80%
            )
          `,
          boxShadow: isDark
            ? `0 0 ${s.size / 6}px rgba(${rgb}, 0.3)`
            : `0 0 ${s.size / 8}px rgba(${rgb}, 0.2)`,
        }

        return (
          <div
            key={s.id}
            className={`absolute rounded-full blur-2xl mix-blend-screen transition-opacity duration-700 ease-out
                       ${s.visible ? (isDark ? "opacity-70" : "opacity-50") : "opacity-0"}`}
            style={style}
          />
        )
      })}
    </div>
  )
}