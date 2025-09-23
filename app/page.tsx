import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Eloquence'25 | CAHCET National Tech Symposium",
  description: "Official website for Eloquence'25, the National Tech Symposium at C. Abdul Hakeem College of Engineering and Technology.",
  keywords: [
    "symposium",
    "cahcet",
    "cachet",
    "cahcet symposium",
    "cahcet eloquence",
    "eloquence cahcet",
    "technical symposium",
    "college",
    "vellore",
    "melvisharam",
    "engineering",
    "technology",
    "national event",
    "student event",
    "coding",
    "paper presentation",
    "quiz",
    "gaming",
    "design",
    "hackathon",
    "CAHCET symposium",
    "Eloquence 25",
    "C Abdul Hakeem College",
    "Ranipet",
    "Tamil Nadu",
    "tech fest",
    "college fest",
    "India symposium"
  ],
  other: {
    "google-site-verification":"CjN_JJcnkw_xzymW0JRsZEicq0ZNsURnJrPIHzMizMs"
  }
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import EventsIconsStrip from "@/components/sections/events-icons-strip"
import SponsorsSection from "@/components/sections/sponsors-section"
import PatronsSection from "@/components/sections/patrons-section"
import CountdownTimer from "@/components/countdown-timer"
import FloatingIcons from "@/components/floating-icons"
import BackgroundGrid from "@/components/background-grid"
import { Utensils, Code2, Globe, HelpCircle } from "lucide-react"

function IconPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border bg-card/60 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      {children}
    </div>
  )
}

export default async function HomePage() {
  return (
    <main>
      {/* HERO */}
  <section className="relative mx-auto w-full max-w-5xl px-[2vw] sm:px-4 py-[6vh] sm:py-8 md:py-12 lg:py-16 xl:py-20 text-center">
        <BackgroundGrid />
        <FloatingIcons variant="hero" />
<div
  className="relative flex flex-col items-center gap-0 sm:gap-1"
  style={{ marginTop: 'clamp(0rem, -2vw, -5rem)' }}
>
  <div className="flex flex-col items-center gap-0 sm:gap-0">
    <img
      src="/cahcet-logo.png"
      alt="CAHCET College logo"
      className="h-20 w-20 sm:h-20 sm:w-20 md:h-40 md:w-40 rounded-md border bg-card p-1 mt-[-0.25rem]"
    />
  
            <div className="text-base sm:text-lg md:text-xl font text-center mb-2" style={{ fontFamily: 'Helvetica', fontWeight: 'bold' ,fontSize: '1.5em' }}>
              C. ABDUL HAKEEM COLLEGE OF ENGINEERING AND TECHNOLOGY
            </div>
          </div>
          <p
  className="text-nowrap font-small text opacity-75 mb-2"
  style={{
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    fontSize: 'clamp(0.8rem, 1.5vw, 1.2em)',
    lineHeight: '1.2'
  }}
>
  Department of Computer Science and Engineering
</p>

<p
  className="text-nowrap font-small text opacity-75 mb-2"
  style={{
    fontFamily: 'Monotype Corsiva, cursive',
    fontWeight: 'normal',
    fontSize: 'clamp(0.8rem, 1.5vw, 1.1em)',
    lineHeight: '1.2'
  }}
>
  proudly presents
</p>
         
         <h1
            className="text-balance font-Helvetica font-black leading-tight tracking-tight whitespace-nowrap mb-2"
            style={{
              fontFamily: 'Decaydence',
              letterSpacing: '0.07em',
              fontSize: 'clamp(20px, 7vw, 72px)',
              maxWidth: '100vw',
              lineHeight: 1.0,
            }}
          >
            <span className="hidden sm:inline">ELOQUENCE'25</span>
            <span className="sm:hidden">ELOQUENCE'25</span>
          </h1>
                    <p
  className="text-nowrap font-medium text opacity-75"
  style={{
    fontFamily: 'Helvetica',
    fontWeight: 'normal' ,
    fontSize: 'clamp(0.8rem, 1.5vw, 1.2em)',
    lineHeight: '1.2'
  }}
>
  A National Level Technical Symposium
</p><CountdownTimer target="2025-11-01T09:00:00+05:30" className="mt-2 mx-auto w-full max-w-xs mb-2" />
          <p className="text-xs text opacity-75">November 01, 2025 • 9:00 AM IST</p>
          {/* CTAs */}
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-1 w-full" id="register">
            <Link href="/register">
<Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground transition-colors">

    Register Now
  </Button>
</Link>

<Link href="/events">
  <Button
    variant="glass"
    className="rounded-full w-full sm:w-auto px-6 py-3"
  >
    View Events
  </Button>
</Link>

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto w-full max-w-6xl px-2 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">About the Event</h2>
            <p className="mt-2 sm:mt-3 md:text-base text opacity-75">
              Dive into coding challenges, paper presentations, design, quizzes, gaming and more. Eloquence&apos;25
              brings students from across India to learn, build, and have fun.<br />
              <br />
              Experience a vibrant atmosphere where innovation meets inspiration. Participate in hands-on workshops, showcase your skills in competitive events, and connect with industry experts and fellow tech enthusiasts. Whether you are a coder, designer, gamer, or simply passionate about technology, Eloquence&apos;25 offers something for everyone.<br />
              <br />
              Join us for a day filled with knowledge sharing, creativity, and excitement. Unlock new opportunities, win exciting prizes, and make memories that last a lifetime!
            </p>

          </div>
          <div className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col items-center">
            <img
              src="/cahcet_top.jpg"
              alt="C Abdul Hakeem College of Engineering and Technology"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-md border bg-card p-2 mb-4 object-cover"
            />
            <div className="text-center text-xs sm:text-sm text opacity-75 font-medium">
              Venue: C Abdul Hakeem College of Engineering and Technology, Melvisharam, Ranipet District
            </div>
          </div>
        </div>
      </section>

      {/* PATRONS */}
      <div className="w-full px-2 sm:px-4">
        <PatronsSection />
      </div>

      {/* SPONSORS (big) */}
      <div className="w-full px-2 sm:px-4">
        <SponsorsSection />
      </div>

      {/* LOCATION + ORGANISATIONS */}
      <section id="location" className="mx-auto w-full max-w-6xl px-2 sm:px-4 py-8 sm:py-12 md:py-16">
        <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-semibold">Location</h2>
        <p className="text-xs sm:text-sm text opacity-75">C. Abdul Hakeem College of Engineering and Technology, Ranipet District - 632 509.</p>
        <div className="mt-3 sm:mt-4">
          <iframe
            title="College Map"
            className="h-48 sm:h-72 w-full rounded-lg border"
            src="https://maps.google.com/maps?q=C%20Abdul%20Hakeem%20College%20of%20Engineering%20and%20Technology&t=&z=13&ie=UTF8&iwloc=&output=embed"
          />
        </div>

      </section>
    </main>
  )
}
