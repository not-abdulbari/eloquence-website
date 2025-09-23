import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BackgroundGrid from "@/components/background-grid"
import FloatingIcons from "@/components/floating-icons"
import { Search, Home, AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundGrid />
      <FloatingIcons variant="hero" />
      
      <main className="container mx-auto flex-grow flex flex-col items-center justify-center px-4 py-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/20">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
          </div>
          
          <h1 className="text-8xl font-bold text-muted-foreground/30">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/events">
                <Search className="mr-2 h-4 w-4" />
                Browse Events
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}