"use client"

import type React from "react"

import { useEffect, useState } from "react"

type Spot = {
  id: number
  x: number // 0-100 vw
  y: number // 0-100 vh
  size: number // px
  color: "orange" | "violet"
  visible: boolean
}

const ORANGE = "255,115,0" // neon orange
const VIOLET = "168,85,247" // neon violet

export default function BackgroundGrid() {
  const [spots, setSpots] = useState<Spot[]>([])

  // Seed a few spots once
  useEffect(() => {
    const seeded: Spot[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 140 + Math.random() * 120,
      color: Math.random() > 0.5 ? "orange" : "violet",
      visible: Math.random() > 0.6,
    }))
    setSpots(seeded)

    // Every 1.6s toggle visibility and slightly move a random subset
    const id = setInterval(() => {
      setSpots((prev) =>
        prev.map((s) => {
          // 35% chance to toggle/pop with small drift
          if (Math.random() < 0.35) {
            return {
              ...s,
              visible: !s.visible,
              x: (s.x + (Math.random() * 12 - 6) + 100) % 100,
              y: (s.y + (Math.random() * 12 - 6) + 100) % 100,
            }
          }
          return s
        }),
      )
    }, 1600)
    return () => clearInterval(id)
  }, [])

  return (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 w-screen h-screen -z-10">
      {/* Base subtle grid - increased visibility; slightly softer in dark */}
      <div className="absolute inset-0 bg-grid opacity-[0.35] dark:opacity-[0.28]" />
      {/* Neon bright spots that pop on/off, always behind text */}
      {spots.map((s) => {
        const style: React.CSSProperties = {
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(closest-side, rgba(var(--neon-spot),0.55), rgba(var(--neon-spot),0) 70%)",
        }
        return (
          <div
            key={s.id}
            className={`absolute rounded-full blur-2xl transition-opacity duration-700 ease-out mix-blend-screen ${
              s.visible ? "opacity-60 dark:opacity-50" : "opacity-0"
            }`}
            style={style}
          />
        )
      })}
    </div>
  )
}
