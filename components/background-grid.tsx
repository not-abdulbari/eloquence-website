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
  opacity: number // New property for smooth transitions
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
    // Increased from 5 to 15 spots for better coverage
    const seeded: Spot[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 100 + Math.random() * 200, // Slightly smaller but more numerous
      hue: isDark ? "red" : Math.random() > 0.5 ? "violet" : "yellow",
      visible: false, // Start invisible
      opacity: 0,     // Start with 0 opacity
    }))
    setSpots(seeded)

    const id = setInterval(() => {
      setSpots((prev) =>
        prev.map((s) => {
          // Higher probability of changes for more dynamic effect
          const shouldChange = Math.random() < 0.6
          
          if (!shouldChange) return s

          const newHue = isDark
            ? "red"
            : Math.random() > 0.5
              ? "violet"
              : "yellow"

          // More aggressive movement for better screen coverage
          const newX = (s.x + (Math.random() * 12 - 6) + 100) % 100
          const newY = (s.y + (Math.random() * 12 - 6) + 100) % 100

          // Higher probability of visibility changes
          const shouldToggle = Math.random() < 0.5
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
    }, 1500) // Faster updates for more dynamic effect

    return () => clearInterval(id)
  }, [isDark])

  // Handle smooth opacity transitions
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setSpots(prev => 
        prev.map(spot => {
          // Calculate target opacity based on visibility
          const targetOpacity = spot.visible ? (isDark ? 0.8 : 0.6) : 0
          
          // Smoothly transition opacity
          let newOpacity = spot.opacity
          const transitionSpeed = 0.04 // Faster transitions
          
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
    }, 16) // ~60fps for smooth animations

    return () => clearInterval(transitionInterval)
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

      {/* Neon Glow Spots with smooth fade transitions */}
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
              rgba(${rgb}, ${isDark ? 0.9 : 0.7}),
              rgba(${rgb}, ${isDark ? 0.5 : 0.4}) 50%,
              rgba(${rgb}, ${isDark ? 0.2 : 0.15}) 70%,
              transparent 80%
            )
          `,
          boxShadow: isDark
            ? `0 0 ${s.size / 5}px rgba(${rgb}, 0.4)`
            : `0 0 ${s.size / 6}px rgba(${rgb}, 0.3)`,
          opacity: s.opacity,
        }

        return (
          <div
            key={s.id}
            className="absolute rounded-full blur-2xl mix-blend-screen transition-opacity duration-1000 ease-out"
            style={style}
          />
        )
      })}
    </div>
  )
}