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
    // Determine intensity based on device and user preference
    const intensity = prefersReducedMotion ? 0.3 : isMobile ? 0.5 : 1
    const count = Math.max(4, Math.round(12 * intensity))
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

    // Slow down updates on mobile/reduced-motion
    const intervalMs = prefersReducedMotion ? 4000 : isMobile ? 3000 : 2000
    const movement = prefersReducedMotion ? 1 : isMobile ? 2 : 4
    const toggleChance = prefersReducedMotion ? 0.15 : isMobile ? 0.25 : 0.4

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
          const newX = (s.x + (Math.random() * movement - movement / 2) + 100) % 100
          const newY = (s.y + (Math.random() * movement - movement / 2) + 100) % 100

          // Ensure visibility changes happen regularly
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

  // Handle smooth opacity transitions
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setSpots(prev => 
        prev.map(spot => {
          // Lower opacity on mobile/reduced-motion to reduce overdraw
          const maxOpacity = prefersReducedMotion ? 0.4 : isMobile ? 0.55 : (isDark ? 0.8 : 0.7)
          const targetOpacity = spot.visible ? maxOpacity : 0
          let newOpacity = spot.opacity
          const transitionSpeed = prefersReducedMotion ? 0.01 : isMobile ? 0.015 : 0.02

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
    // Lower frame rate on mobile/reduced-motion
    }, prefersReducedMotion ? 50 : isMobile ? 24 : 16)

    return () => clearInterval(transitionInterval)
  }, [isDark, isMobile, prefersReducedMotion])

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
              rgba(${rgb}, ${prefersReducedMotion || isMobile ? 0.5 : (isDark ? 0.8 : 0.7)}),
              rgba(${rgb}, ${prefersReducedMotion || isMobile ? 0.3 : 0.5}) 50%,
              rgba(${rgb}, ${prefersReducedMotion || isMobile ? 0.15 : 0.2}) 70%,
              transparent 85%
            )
          `,
          boxShadow: prefersReducedMotion || isMobile
            ? `0 0 ${Math.max(8, s.size / 8)}px rgba(${rgb}, 0.25)`
            : (isDark
              ? `0 0 ${s.size / 5}px rgba(${rgb}, 0.4)`
              : `0 0 ${s.size / 6}px rgba(${rgb}, 0.4)`),
          opacity: s.opacity,
        }

        return (
          <div
            key={s.id}
            className={
              `absolute rounded-full ${prefersReducedMotion || isMobile ? 'blur-xl' : 'blur-3xl'} ` +
              `${prefersReducedMotion || isMobile ? '' : 'mix-blend-screen'} transition-opacity duration-1000 ease-in-out`
            }
            style={style}
          />
        )
      })}
    </div>
  )
}