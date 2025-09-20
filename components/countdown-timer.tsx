"use client"

import { useEffect, useMemo, useState } from "react"

type Props = {
  // Pass ISO string with timezone, e.g. "2025-10-13T09:00:00+05:30"
  target: string
  className?: string
}

export default function CountdownTimer({ target, className }: Props) {
  // Freeze date instance
  const targetDate = useMemo(() => new Date(target), [target])
  const [diff, setDiff] = useState<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDiff(Math.max(targetDate.getTime() - Date.now(), 0))
    const id = setInterval(() => {
      setDiff(Math.max(targetDate.getTime() - Date.now(), 0))
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!mounted) return null
  
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
  <div className={className + " flex justify-center"} aria-live="polite" aria-atomic>
      <div className="flex items-center gap-1 rounded-xl border bg-card px-2 py-1 text-sm w-fit">
        <TimeBlock label="Days" value={days} />
        <span className="opacity-60">:</span>
        <TimeBlock label="Hours" value={hours} />
        <span className="opacity-60">:</span>
        <TimeBlock label="Minutes" value={minutes} />
        <span className="opacity-60">:</span>
        <TimeBlock label="Seconds" value={seconds} />
      </div>
    </div>
  )
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  const padded = String(value).padStart(2, "0")
  return (
    <div className="flex min-w-10 flex-col items-center justify-center rounded-lg bg-muted px-1 py-1">
      <div className="font-sans text-lg font-semibold tabular-nums">{padded}</div>
      <div className="text-[10px] uppercase tracking-wide text opacity-50">{label}</div>
    </div>
  )
}
