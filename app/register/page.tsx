// app/register/page.tsx
"use client"

import BackgroundGrid from "@/components/background-grid"
import BlurBubbles from "@/components/blur-bubbles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center">
      <BackgroundGrid />
      <BlurBubbles />

      <div className="relative z-10 w-full max-w-xl px-4">
        <Card className="border-foreground/10 bg-background/80 backdrop-blur-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600 mt-5">
              Online Registration Closed
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-lg font-medium">
              Online registrations have officially ended.
            </p>

            <p className="text-muted-foreground">
              Participants can register <strong>on the spot</strong> on the
              day of the event by visiting the registration desk in person.
            </p>

            <p className="font-semibold text-primary">
              📍 Please carry a valid college ID
            </p>

            <p className="text-sm text-muted-foreground mb-5">
              Thank you for your interest. We look forward to seeing you at the event!
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
