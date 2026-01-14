"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Instagram, Linkedin, Mail } from "lucide-react"
import useSWR from "swr"
import { fetchSiteData } from "@/lib/fetcher"
import { SiteData } from "@/lib/types"

export default function SiteFooter() {
  const { data: siteData } = useSWR<SiteData>("/data/site-data.json", fetchSiteData)

  if (!siteData) {
    return (
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-center opacity-75">Loading...</p>
        </div>
      </footer>
    )
  }

  // Get events dynamically from site data
  const technicalEvents = siteData.events
    .filter(event => event.type === "tech")
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(event => ({
      name: event.title,
      href: `/events/${event.id}`
    }))

  const nonTechnicalEvents = siteData.events
    .filter(event => event.type === "non-tech")
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(event => ({
      name: event.title,
      href: `/events/${event.id}`
    }))

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-m font-semibold" style={{ fontFamily: 'Decaydence', letterSpacing: '0.01em' }}>
              {siteData.symposium}
            </h3>
            <p className="text-sm text opacity-75 text-pretty">
              National-level technical symposium by {siteData.department}, {siteData.college}.
            </p>

            <div className="flex gap-3 text opacity-75">
              <Link aria-label="Instagram" href="https://instagram.com/eloquence_2025" className="hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link aria-label="Mail" href="mailto:info@eloquence.in.net" className="hover:text-foreground">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Technical Events */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Technical Events</h4>
            <ul className="space-y-2 text-sm text opacity-75">
              {technicalEvents.map((event, index) => (
                <li key={index}>
                  <Link href={event.href} className="hover:text-foreground">
                    {event.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Non-Technical Events */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Non‑Technical Events</h4>
            <ul className="space-y-2 text-sm text opacity-75">
              {nonTechnicalEvents.map((event, index) => (
                <li key={index}>
                  <Link href={event.href} className="hover:text-foreground">
                    {event.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium">Get Started</h4>
            <Link href="/register">
<Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground transition-colors">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-xs opacity-75">
          © {new Date().getFullYear()} Eloquence&apos;25 · CSE, CAHCET · All rights reserved
        </div>

      </div>
    </footer>
  )
}