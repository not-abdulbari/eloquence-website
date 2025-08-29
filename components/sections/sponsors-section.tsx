import Image from "next/image"

export default function SponsorsSection() {
  const sponsors = [
    { alt: "CSI", w: 300, h: 40, q: "CSI logo" },
    { alt: "MSME", w: 300, h: 40, q: "MSME logo" },
    { alt: "Smart Innovative Solutions", w: 300, h: 40, q: "Smart Innovative Solutions logo" },
    { alt: "IEEE", w: 300, h: 40, q: "IEEE logo" },
    { alt: "StartupTN", w: 300, h: 40, q: "StartupTN logo" },
  ]

  return (
    <section id="sponsors" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8">
        <h2 className="text-balance text-3xl font-semibold">Sponsors & Organisations</h2>
      </div>

      <div className="grid place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((s) => (
          <div key={s.alt} className="flex h-24 w-full items-center justify-center rounded-xl border bg-card p-4">
            <Image
              src={`https://placehold.co/1600x400.png?height=${s.h}&width=${s.w}`}
              alt={s.alt}
              width={s.w}
              height={s.h}
              className="opacity-90"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
