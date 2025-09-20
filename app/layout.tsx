import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Lilita_One } from "next/font/google"
import "./globals.css"
import SiteNavbar from "@/components/site-navbar"
import SiteFooter from "@/components/site-footer"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import BlurBubbles from "@/components/blur-bubbles"

const display = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Eloquence'25 - A National level Technical Symposium",
  description: "Symposium website for C Abdul Hakeem College of Engineering and Technology's Department of Computer Science and Engineering.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`font-sans ${GeistSans.variable} ${display.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph and Twitter Card for social sharing preview */}
        <meta property="og:title" content="Eloquence 25 - A National level Technical Symposium" />
        <meta property="og:description" content="Symposium website for C Abdul Hakeem College of Engineering and Technology's Department of Computer Science and Engineering." />
        <meta property="og:image" content="https://eloquence.in.net/image.png" />
        <meta property="og:image:alt" content="Eloquence 25" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eloquence.in.net" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Eloquence 25 - A National level Technical Symposium" />
        <meta name="twitter:description" content="Symposium website for C Abdul Hakeem College of Engineering and Technology's Department of Computer Science and Engineering." />
        <meta name="twitter:image" content="/image.png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <BlurBubbles />
          <Suspense fallback={<div>Loading...</div>}>
            <SiteNavbar />
            {/* Spacer for fixed navbar to avoid overlap */}
            <div aria-hidden className="h-16 md:h-20"></div>
            {children}
            <SiteFooter />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
