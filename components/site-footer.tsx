import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Instagram, Linkedin, Mail } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold"style={{ fontFamily: 'Decaydence', letterSpacing: '0.01em' }}>
              Eloquence &apos;25</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              National-level technical symposium by CSE, C Abdul Hakeem College of Engineering &amp; Technology.
            </p>

            <div className="flex gap-3 text-muted-foreground">
              <Link aria-label="Instagram" href="https://instagram.com" className="hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link aria-label="LinkedIn" href="https://linkedin.com" className="hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link aria-label="Mail" href="mailto:info@example.com" className="hover:text-foreground">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium">Tech</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events/pp" className="hover:text-foreground">
                  Paper Presentation
                </Link>
              </li>
              <li>
                <Link href="/events/ac" className="hover:text-foreground">
                  Aptitude & Coding
                </Link>
              </li>
              <li>
                <Link href="/events/tq" className="hover:text-foreground">
                  Tech Quiz
                </Link>
              </li>
              <li>
                <Link href="/events/wd" className="hover:text-foreground">
                  Web Designing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium">Non‑Tech</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events/cwf" className="hover:text-foreground">
                  CWF
                </Link>
              </li>
              <li>
                <Link href="/events/art" className="hover:text-foreground">
                  Art Competition
                </Link>
              </li>
              <li>
                <Link href="/events/conn" className="hover:text-foreground">
                  Connection
                </Link>
              </li>
              <li>
                <Link href="/events/mem" className="hover:text-foreground">
                  Memory Game
                </Link>
              </li>
              <li>
                <Link href="/events/bgmi" className="hover:text-foreground">
                  BGMI & FF
                </Link>
              </li>
              <li>
                <Link href="/events/sf" className="hover:text-foreground">
                  Short Film
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium">Get Started</h4>
            <Link href="#register">
              <Button variant="secondary" className="rounded-full">
                Register
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-xs text-muted-foreground">
          © 2025 Eloquence&apos;25 · CSE, CAHCET · All rights reserved
        </div>
      </div>
    </footer>
  )
}
