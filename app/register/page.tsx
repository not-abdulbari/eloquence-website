"use client"

import BackgroundGrid from "@/components/background-grid"
import BlurBubbles from "@/components/background-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <BackgroundGrid />
      <BlurBubbles />
      
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wider" style={{
              fontFamily: 'Decaydence',
              letterSpacing: '0.07em',
              fontSize: 'clamp(20px, 7vw, 72px)',
              maxWidth: '100vw',
              lineHeight: 1.0,
            }}>
            STAY TUNED!
          </h1>
          <p className="text opacity-50">
            Registration details will be announced soon. We look forward to your participation in this exciting event!
          </p>
        </div>          
        </div>
    </main>
  )
}