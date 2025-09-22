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
    // Reduced bubble count for less visual noise
    const intensity = prefersReducedMotion ? 0.2 : isMobile ? 0.3 : 0.5
    const count = Math.max(2, Math.round(5 * intensity))
    const baseSize = 100 * intensity + (isMobile ? 40 : 100)

    const initialBubbles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: baseSize + Math.random() * (120 * intensity),
      opacity: 0,
      targetOpacity: Math.random() * 0.15 + 0.05, // Lower max opacity
      color: isDark ? 'red' : (['red', 'purple', 'orange'][Math.floor(Math.random() * 3)] as 'red' | 'purple' | 'orange')
    }))
    setBubbles(initialBubbles)

    // Slower, more controlled animations
    const movement = prefersReducedMotion ? 0.3 : isMobile ? 0.5 : 1
    const intervalMs = prefersReducedMotion ? 6000 : isMobile ? 5000 : 4000
    const opacityChangeChance = prefersReducedMotion ? 0.1 : isMobile ? 0.2 : 0.3

    const interval = setInterval(() => {
      setBubbles(prev => 
        prev.map(bubble => {
          // Smooth, constrained movement
          const newX = Math.max(10, Math.min(90, bubble.x + (Math.random() * movement * 2 - movement)))
          const newY = Math.max(10, Math.min(90, bubble.y + (Math.random() * movement * 2 - movement)))
          
          // Controlled opacity changes
          const shouldChangeOpacity = Math.random() < opacityChangeChance
          const newTargetOpacity = shouldChangeOpacity 
            ? Math.random() * 0.15 + 0.05
            : bubble.targetOpacity
          
          // Infrequent color changes
          let newColor = bubble.color
          if (!isDark) {
            const shouldChangeColor = Math.random() < 0.05
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

  // Handle smooth, consistent opacity transitions
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setBubbles(prev => 
        prev.map(bubble => {
          let newOpacity = bubble.opacity
          // Very slow transitions to prevent blinking
          const transitionSpeed = 0.005
          
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
    }, 30) // Consistent frame rate

    return () => clearInterval(transitionInterval)
  }, [])

  // Get color class with consistent low opacity
  const getColorClass = (color: 'red' | 'purple' | 'orange') => {
    if (isDark) {
      return 'bg-red-600/15' // Very low opacity for dark mode
    } else {
      switch (color) {
        case 'red': return 'bg-red-500/20'
        case 'purple': return 'bg-purple-500/20'
        case 'orange': return 'bg-orange-400/20'
      }
    }
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full blur-2xl transition-all duration-1000 ease-out ${getColorClass(bubble.color)}`}
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