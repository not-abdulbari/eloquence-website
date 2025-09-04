"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-[2vh] z-50 flex justify-center pointer-events-none" aria-hidden={false}>
      <header
        aria-label="Primary"
        className="pointer-events-auto mx-auto flex w-full max-w-[92vw] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] items-center justify-between rounded-full border border-foreground/10 bg-background/70 px-[1vw] sm:px-2 py-[0.7vh] shadow-lg ring-1 ring-black/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-center w-full relative">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-2 text-[3.5vw] sm:text-base font-semibold tracking-tight text-foreground whitespace-nowrap mr-20"
            style={{ fontFamily: 'Decaydence', letterSpacing: '0.01em' }}
            onClick={() => setMenuOpen(false)} // ✅ close when clicking brand
          >
            Eloquence&apos;25
          </Link>

          {/* Nav links */}
          <nav
            aria-label="Main"
            className={`mx-2 items-center gap-5 ${
              menuOpen
                ? "flex flex-col absolute top-full left-0 w-full bg-background rounded-b-xl shadow-lg p-4 sm:p-0 z-50"
                : "hidden"
            } md:flex md:static md:flex-row md:bg-transparent md:rounded-none md:shadow-none md:p-0`}
          >
            <Link
              href="/events"
              className="text-sm transition-colors hover:text-foreground"
              onClick={() => setMenuOpen(false)} // ✅ close after click
            >
              Events
            </Link>
            <Link
              href="#location"
              className="text-sm transition-colors hover:text-foreground"
              onClick={() => setMenuOpen(false)} // ✅ close after click
            >
              Location
            </Link>

            {/* Mobile Register */}
            {menuOpen && (
              <Link
                href="#register"
                className="block w-full mt-2 sm:hidden"
                onClick={() => setMenuOpen(false)} // ✅ close after click
              >
                <Button className="w-full rounded-full bg-[#b97a56] text-white hover:bg-[#a86a48] dark:bg-[#800000] dark:hover:bg-[#660000] dark:text-white text-xs px-3 py-2 transition-colors">
                  Register
                </Button>
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1 ml-auto">
            <Link href="#register" className="hidden sm:block">
              <Button className="rounded-full bg-[#b97a56] text-white hover:bg-[#a86a48] dark:bg-[#800000] dark:hover:bg-[#660000] dark:text-white text-xs sm:text-sm px-3 py-1 transition-colors">
                Register
              </Button>
            </Link>
            <ThemeToggle />
            {/* Hamburger */}
            <button
              className="sm:hidden flex items-center justify-center bg-transparent border-none shadow-none p-0 m-0 mr-1"
              aria-label="Open menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}
