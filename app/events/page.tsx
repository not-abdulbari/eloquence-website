"use client"

import type React from "react"

import useSWR from "swr"
import Link from "next/link"
import fetcher from "@/lib/fetcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BackgroundGrid from "@/components/background-grid"
import FloatingIcons from "@/components/floating-icons"
import BlurBubbles from "@/components/blur-bubbles"
import {
  Code2,
  ChefHat,
  Globe,
  FileText,
  Gamepad2,
  Clapperboard,
  HelpCircle,
  Brain,
  Link2,
  Compass,
  Grid3x3,   // ✅ for Chess (3x3 grid = board)
  PenTool,   // ✅ for Mehendi (hand-drawn art)
} from "lucide-react"

// Type assertions
const TypedBlurBubbles = BlurBubbles as React.ComponentType<{ variant?: string }>
const TypedFloatingIcons = FloatingIcons as React.ComponentType<{ variant?: string }>

type EventItem = {
  id: string
  title: string
  type: "tech" | "non-tech"
  short?: string
  icon?: string
  image?: string
  imageAlt?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // --- Technical Events ---
  "coding-debugging": Code2,
  "paper-presentation": FileText,
  "poster-making": Palette,
  "tech-quiz": Brain,
  "web-designing": Globe,

  // --- Non-Technical Events ---
  esports: Gamepad2,
  "reels-photography": Clapperboard,
  connection: Link2,
  "cooking-without-fire": ChefHat,
  "treasure-hunt": Compass,
  chess: Grid3x3,     // ✅ 3x3 grid = chess board metaphor
  mehendi: PenTool,   // ✅ pen for hand-drawn henna

  // --- Legacy fallbacks ---
  coding: Code2,
  code: Code2,
  ac: Code2,
  wd: Globe,
  web: Globe,
  pp: FileText,
  quiz: HelpCircle,
  tq: HelpCircle,
  gaming: Gamepad2,
  bgmi: Gamepad2,
  filming: Clapperboard,
  sf: Clapperboard,
  art: PenTool,
  mem: Brain,
  conn: Link2,
  cooking: ChefHat,
}

// Re-import Palette only if used elsewhere (e.g., poster-making)
// If not, you can remove it from imports
import { Palette } from "lucide-react"

function EventIcon({ id }: { id: string }) {
  const key = id.toLowerCase()
  const Icon = iconMap[key] || Code2
  return <Icon className="h-5 w-5 text-primary" />
}

function EventCard({ e }: { e: EventItem }) {
  const imgSrc = e.image || "/vibrant-outdoor-event.png"
  const imgAlt = e.imageAlt || `${e.title} image`

  return (
    <Link href={`/events/${e.id}`}>
      <Card className="h-full transition hover:shadow-sm">
        <div className="relative overflow-hidden rounded-t-xl border-b border-border bg-background/40">
          <img
            src={imgSrc}
            alt={imgAlt}
            loading="lazy"
            className="h-40 w-full object-cover"
          />
        </div>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EventIcon id={e.icon || e.id} />
            {e.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-75 mb-6">
            {e.short ?? "Click to view details"}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function EventsPage() {
  const { data } = useSWR<{ events: EventItem[] }>("/data/site-data.json", fetcher)
  const events = data?.events ?? []

  const byType = (t: "tech" | "non-tech") => events.filter((e) => e.type === t)

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12">
      <BackgroundGrid />
      <TypedBlurBubbles variant="events" />
      <TypedFloatingIcons variant="events" />

      <div className="relative z-10">
        <h1 className="mb-8 text-3xl font-bold">Events</h1>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Technical Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byType("tech").map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold">Non‑Technical Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byType("non-tech").map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}