"use client"

import { useEffect, useState } from "react"

export default function BlurBubbles() {
  const [isDark, setIsDark] = useState(false)
  const [bubbles, setBubbles] = useState<{id: number, x: number, y: number, size: number, opacity: number, targetOpacity: number, color: 'red' | 'purple' | 'orange'}[]>([])

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

  // Create animated bubbles
  useEffect(() => {
    const initialBubbles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 100 + Math.random() * 150,
      opacity: 0, // Start invisible
      targetOpacity: Math.random() * 0.3 + 0.2, // Reduced target opacity between 0.2-0.5
      color: isDark ? 'red' : (['red', 'purple', 'orange'][Math.floor(Math.random() * 3)] as 'red' | 'purple' | 'orange') // Red only for dark mode
    }))
    setBubbles(initialBubbles)

    const interval = setInterval(() => {
      setBubbles(prev => 
        prev.map(bubble => {
          // Update position with gentle movement
          const newX = (bubble.x + (Math.random() * 6 - 3) + 100) % 100
          const newY = (bubble.y + (Math.random() * 6 - 3) + 100) % 100
          
          // Change target opacity for constant fade cycle
          const shouldChangeOpacity = Math.random() < 0.5 // More frequent changes
          const newTargetOpacity = shouldChangeOpacity 
            ? Math.random() * 0.3 + 0.2 // New target between 0.2-0.5
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
    }, 1500) // Update more frequently

    return () => clearInterval(interval)
  }, [isDark])

  // Handle smooth opacity transitions
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setBubbles(prev => 
        prev.map(bubble => {
          let newOpacity = bubble.opacity
          const transitionSpeed = 0.025 // Smooth transition speed
          
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
    }, 16) // ~60fps for smooth animations

    return () => clearInterval(transitionInterval)
  }, [])

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
          className={`absolute rounded-full blur-3xl mix-blend-screen transition-all duration-1000 ease-in-out ${getColorClass(bubble.color)}`}
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