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
  Palette,
  Brain,
  Link2,
  Compass,
} from "lucide-react"
import { connection } from "next/server"

// Type assertions for components with variant prop
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
  
  // --- Original mappings preserved ---
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
  art: Palette,
  mem: Brain,
  conn: Link2,
  cooking: ChefHat,
};

function EventIcon({ id }: { id: string }) {
  const key = id.toLowerCase()
  const Icon = iconMap[key] || Code2
  return <Icon className="h-5 w-5 text-primary" />
}

function EventCard({ e }: { e: EventItem }) {
  const imgSrc = e.image || "/vibrant-outdoor-event.png"
  const imgAlt = e.imageAlt || `${e.title} image`

  return (
    <Link href={`/events/${e.id}`} className="w-full mx-auto">
      <Card className="h-full transition hover:shadow-sm overflow-hidden rounded-xl border border-border">
        {/* Image container with proper aspect ratio */}
        <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-t-xl">
          <img 
            src={imgSrc || "/placeholder.svg"} 
            alt={imgAlt} 
            loading="lazy" 
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>

        <CardHeader className="p-4 pt-3">
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <EventIcon id={e.icon || e.id} />
              {e.title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pb-3">
          <p className="text-sm text-muted-foreground">{e.short ?? "Click to view details"}</p>
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