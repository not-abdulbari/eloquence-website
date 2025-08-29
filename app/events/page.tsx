"use client"

import type React from "react"

import useSWR from "swr"
import Link from "next/link"
import fetcher from "@/lib/fetcher" // Import the fetcher function
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

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
  connection: Link2,
  cooking: ChefHat,
}

function EventIcon({ id }: { id: string }) {
  const key = id.toLowerCase()
  const Icon = iconMap[key] || Code2
  return <Icon className="h-5 w-5 text-primary" />
}

function EventCard({ e, badge }: { e: EventItem; badge: React.ReactNode }) {
  const imgSrc = e.image || "/vibrant-outdoor-event.png"
  const imgAlt = e.imageAlt || `${e.title} image`

  return (
    <Link href={`/events/${e.id}`}>
      <Card className="h-full transition hover:shadow-sm">
        {/* Media area */}
        <div className="relative overflow-hidden rounded-t-xl border-b border-border bg-background/40">
          <img src={imgSrc || "/placeholder.svg"} alt={imgAlt} loading="lazy" className="h-40 w-full object-cover" />
        </div>

        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <EventIcon id={e.icon || e.id} />
              {e.title}
            </span>
            {badge}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Events</h1>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Tech</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byType("tech").map((e) => (
            <EventCard key={e.id} e={e} badge={<Badge variant="outline">Tech</Badge>} />
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">Non‑Tech</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byType("non-tech").map((e) => (
            <EventCard key={e.id} e={e} badge={<Badge variant="secondary">Fun</Badge>} />
          ))}
        </div>
      </section>
    </main>
  )
}
