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
    // Initialize with more spots for better coverage
    const seeded: Spot[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 100 + Math.random() * 150,
      hue: isDark ? "red" : Math.random() > 0.5 ? "violet" : "yellow",
      visible: false,
      opacity: 0,
    }))
    setSpots(seeded)

    const id = setInterval(() => {
      setSpots((prev) =>
        prev.map((s) => {
          // Always update every spot (no static ones)
          const newHue = isDark
            ? "red"
            : Math.random() > 0.5
              ? "violet"
              : "yellow"

          // Gentle movement with proper bounds
          const newX = (s.x + (Math.random() * 4 - 2) + 100) % 100
          const newY = (s.y + (Math.random() * 4 - 2) + 100) % 100

          // Ensure visibility changes happen regularly
          const shouldToggle = Math.random() < 0.4
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
    }, 2000)

    return () => clearInterval(id)
  }, [isDark])

  // Handle smooth opacity transitions
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setSpots(prev => 
        prev.map(spot => {
          const targetOpacity = spot.visible ? (isDark ? 0.8 : 0.7) : 0 // Increased light mode opacity
          let newOpacity = spot.opacity
          const transitionSpeed = 0.02

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
    }, 16)

    return () => clearInterval(transitionInterval)
  }, [isDark])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 w-screen h-screen -z-10">
      {/* 🔁 Enhanced Grid – Visible in Both Modes */}
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
              rgba(${rgb}, ${isDark ? 0.8 : 0.7}), // Increased light mode opacity
              rgba(${rgb}, ${isDark ? 0.5 : 0.5}) 50%, // Increased light mode opacity
              rgba(${rgb}, ${isDark ? 0.2 : 0.2}) 70%, // Increased light mode opacity
              transparent 85%
            )
          `,
          boxShadow: isDark
            ? `0 0 ${s.size / 5}px rgba(${rgb}, 0.4)`
            : `0 0 ${s.size / 6}px rgba(${rgb}, 0.4)`, // Increased light mode shadow opacity
          opacity: s.opacity,
        }

        return (
          <div
            key={s.id}
            className="absolute rounded-full blur-3xl mix-blend-screen transition-opacity duration-1000 ease-in-out"
            style={style}
          />
        )
      })}
    </div>
  )
}