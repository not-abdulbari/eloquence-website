"use client"

import type React from "react"

import useSWR from "swr"
import Link from "next/link"
import { fetchSiteData } from "@/lib/fetcher"
import { SiteData } from "@/lib/types"
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
  Palette,
} from "lucide-react"

// Type assertions
const TypedBlurBubbles = BlurBubbles as React.ComponentType<{ variant?: string }>
const TypedFloatingIcons = FloatingIcons as React.ComponentType<{ variant?: string }>

// EventItem type is now imported from types.ts

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

function EventIcon({ id }: { id: string }) {
  const key = id.toLowerCase()
  const Icon = iconMap[key] || Code2
  return <Icon className="h-5 w-5 text-primary" />
}

function EventCard({ event }: { event: SiteData['events'][0] }) {
  const imgSrc = "/vibrant-outdoor-event.png"
  const imgAlt = `${event.title} image`

  return (
    <Link href={`/events/${event.id}`}>
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
          <CardTitle className="flex items-center gap-1">
            <EventIcon id={event.id} />
            {event.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-75 mb-1">
            {event.short}
          </p>
          <div className="text-xs opacity-60 space-y-1 mb-3">
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Time:</strong> {event.timing}</p>
            <p><strong>Fee:</strong> {event.registrationFee}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function EventsPage() {
  const { data } = useSWR<SiteData>("/data/site-data.json", fetchSiteData)
  const siteData = data

  if (!siteData) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-12">
        <BackgroundGrid />
        <TypedBlurBubbles variant="events" />
        <TypedFloatingIcons variant="events" />
        <div className="relative z-10">
          <p className="opacity-75">Loading events...</p>
        </div>
      </main>
    )
  }

  const technicalEvents = siteData.events.filter(event => event.type === "tech")
  const nonTechnicalEvents = siteData.events.filter(event => event.type === "non-tech")

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
            {technicalEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold">Non‑Technical Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nonTechnicalEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}