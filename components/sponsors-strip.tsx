"use client"

import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"

type Sponsor = { name: string; logo: string; url: string }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SponsorsStrip() {
  const { data } = useSWR<{ sponsors: Sponsor[] }>("/data/site-data.json", fetcher)
  const sponsors = data?.sponsors ?? []

  if (!sponsors.length) return null

  return (
    <section id="sponsors" aria-labelledby="sponsors-title" className="border-y bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8">
        <h2 id="sponsors-title" className="text-center text-sm font-medium text-muted-foreground">
          Sponsors
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {sponsors.map((s) => (
            <Link
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition hover:opacity-100"
            >
              <Image
                src={s.logo || "/placeholder.svg"}
                alt={`${s.name} logo`}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
