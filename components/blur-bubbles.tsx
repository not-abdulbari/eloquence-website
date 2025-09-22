"use client"

import { useEffect, useState } from "react"

export default function BlurBubbles() {
  const [isDark, setIsDark] = useState(false)
  const [bubbles, setBubbles] = useState<{id: number, x: number, y: number, size: number, opacity: number, targetOpacity: number, color: 'red' | 'purple' | 'orange'}[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect dark mode via document class
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    const checkMobile = () => {
      try {
        setIsMobile(window.matchMedia('(max-width: 640px)').matches)
      } catch {}
    }
    const checkReducedMotion = () => {
      try {
        setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      } catch {}
    }

    checkTheme()
    checkMobile()
    checkReducedMotion()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributeFilter: ["class"] })

    window.addEventListener('resize', checkMobile)
    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    rmQuery.addEventListener?.('change', checkReducedMotion)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkMobile)
      rmQuery.removeEventListener?.('change', checkReducedMotion)
    }
  }, [])

  // Create animated bubbles
  useEffect(() => {
    const intensity = prefersReducedMotion ? 0.3 : isMobile ? 0.5 : 1
    const count = Math.max(3, Math.round(8 * intensity))
    const baseSize = 100 * intensity + (isMobile ? 40 : 100)

    const initialBubbles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: baseSize + Math.random() * (120 * intensity),
      opacity: 0, // Start invisible
      targetOpacity: Math.random() * (prefersReducedMotion || isMobile ? 0.25 : 0.3) + 0.15,
      color: isDark ? 'red' : (['red', 'purple', 'orange'][Math.floor(Math.random() * 3)] as 'red' | 'purple' | 'orange') // Red only for dark mode
    }))
    setBubbles(initialBubbles)

    const movement = prefersReducedMotion ? 1 : isMobile ? 2 : 3
    const intervalMs = prefersReducedMotion ? 3500 : isMobile ? 2500 : 1500
    const opacityChangeChance = prefersReducedMotion ? 0.25 : isMobile ? 0.4 : 0.5

    const interval = setInterval(() => {
      setBubbles(prev => 
        prev.map(bubble => {
          // Update position with gentle movement
          const newX = (bubble.x + (Math.random() * movement * 2 - movement) + 100) % 100
          const newY = (bubble.y + (Math.random() * movement * 2 - movement) + 100) % 100
          
          // Change target opacity for constant fade cycle
          const shouldChangeOpacity = Math.random() < opacityChangeChance
          const newTargetOpacity = shouldChangeOpacity 
            ? Math.random() * (prefersReducedMotion || isMobile ? 0.25 : 0.3) + 0.15
            : bubble.targetOpacity
          
          // Only change color in light mode
          let newColor = bubble.color
          if (!isDark) {
            const shouldChangeColor = Math.random() < 0.2
            if (shouldChangeColor) {
              newColor = ['red', 'purple', 'orange'][Math.floor(Math.random() * 3)] as 'red' | 'purple' | 'orange'
            }
          }
          
          return {
            ...bubble,
            x: newX,
            y: newY,
            targetOpacity: newTargetOpacity,
            color: newColor
          }
        })
      )
    }, intervalMs)

    return () => clearInterval(interval)
  }, [isDark, isMobile, prefersReducedMotion])

  // Handle smooth opacity transitions
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setBubbles(prev => 
        prev.map(bubble => {
          let newOpacity = bubble.opacity
          const transitionSpeed = prefersReducedMotion ? 0.01 : isMobile ? 0.018 : 0.025
          
          if (bubble.opacity < bubble.targetOpacity) {
            newOpacity = Math.min(bubble.opacity + transitionSpeed, bubble.targetOpacity)
          } else if (bubble.opacity > bubble.targetOpacity) {
            newOpacity = Math.max(bubble.opacity - transitionSpeed, bubble.targetOpacity)
          }
          
          return {
            ...bubble,
            opacity: newOpacity
          }
        })
      )
    }, prefersReducedMotion ? 50 : isMobile ? 24 : 16)

    return () => clearInterval(transitionInterval)
  }, [isMobile, prefersReducedMotion])

  // Get color class based on bubble color and theme
  const getColorClass = (color: 'red' | 'purple' | 'orange') => {
    if (isDark) {
      // Only red variants for dark mode
      return 'bg-red-600/40'
    } else {
      // More vibrant colors for light mode
      switch (color) {
        case 'red': return 'bg-red-500/60'    // Increased opacity for light mode
        case 'purple': return 'bg-purple-500/60' // Increased opacity for light mode
        case 'orange': return 'bg-orange-400/60' // Increased opacity for light mode
      }
    }
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full ${prefersReducedMotion || isMobile ? 'blur-xl' : 'blur-3xl'} ${prefersReducedMotion || isMobile ? '' : 'mix-blend-screen'} transition-all duration-1000 ease-in-out ${getColorClass(bubble.color)}`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
            transform: 'translate(-50%, -50%)',
            opacity: bubble.opacity,
          }}
        />
      ))}
    </div>
  )
}