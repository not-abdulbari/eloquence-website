import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Instagram, Linkedin, Mail } from "lucide-react"

export default function SiteFooter() {
  // Technical Events - Alphabetically Sorted
  const technicalEvents = [
    { name: "Coding & Debugging", href: "/events/coding-debugging" },
    { name: "Paper Presentation", href: "/events/paper-presentation" },
    { name: "Poster Making", href: "/events/poster-making" },
    { name: "Tech Quiz Showdown", href: "/events/tech-quiz" },
    { name: "Web Designing", href: "/events/web-designing" },
  ]

  // Non-Technical Events - Alphabetically Sorted
  const nonTechnicalEvents = [
    { name: "Connection", href: "/events/connection" },
    { name: "Cooking without Fire", href: "/events/cooking-without-fire" },
    { name: "E-Sports", href: "/events/esports" },
    { name: "Reels & Photography", href: "/events/reels-photography" },
    { name: "Treasure Hunt", href: "/events/treasure-hunt" },
  ]

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ fontFamily: 'Decaydence', letterSpacing: '0.01em' }}>
              Eloquence&apos;25
            </h3>
            <p className="text-sm text opacity-50 text-pretty">
              National-level technical symposium by CSE, C Abdul Hakeem College of Engineering &amp; Technology.
            </p>

            <div className="flex gap-3 text opacity-50">
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
            <ul className="space-y-2 text-sm text opacity-50">
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
            <ul className="space-y-2 text-sm text opacity-50">
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
                Register
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-xs text opacity-50">
          © 2025 Eloquence&apos;25 · CSE, CAHCET · All rights reserved
        </div>
      </div>
    </footer>
  )
}