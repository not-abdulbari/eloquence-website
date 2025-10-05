import Image from "next/image"

export default function SponsorsSection() {
  const sponsorCategories = {
    standard: [
      { alt: "Standard Sponsor 1", w: 1500, h: 400 },
      { alt: "Standard Sponsor 2", w: 1500, h: 400 },
      { alt: "Standard Sponsor 3", w: 1500, h: 400 },
    ],
    premium: [
      { alt: "Premium Sponsor 1", w: 1500, h: 400 },
      { alt: "Premium Sponsor 2", w: 1500, h: 400 },
      { alt: "Premium Sponsor 3", w: 1500, h: 400 },
    ],
    elite: [
      { alt: "Elite Sponsor 1", w: 1500, h: 400 },
      { alt: "Elite Sponsor 2", w: 1500, h: 400 },
      { alt: "Elite Sponsor 3", w: 1500, h: 400 },
    ]
  }

  const renderSponsorGrid = (sponsors: { alt: string; w: number; h: number }[]) => (
    <div className="grid place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {sponsors.map((s) => (
        <div
          key={s.alt}
          className="relative w-full pt-[26.67%] rounded-xl border bg-card overflow-hidden"
        >
          <Image
            src={`https://placehold.co/1500x400.png?height=${s.h}&width=${s.w}`}
            alt={s.alt}
            fill
            className="object-contain opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  )

  return (
    <section id="sponsors" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8">
        <h2 className="text-balance text-3xl font-semibold">Sponsors</h2>
      </div>

      {/* Elite Sponsors */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-center">Elite Sponsors</h3>
        {renderSponsorGrid(sponsorCategories.elite)}
      </div>

      {/* Premium Sponsors */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-center">Premium Sponsors</h3>
        {renderSponsorGrid(sponsorCategories.premium)}
      </div>

      {/* Standard Sponsors */}
      <div>
        <h3 className="text-xl font-semibold mb-6 text-center">Standard Sponsors</h3>
        {renderSponsorGrid(sponsorCategories.standard)}
      </div>
    </section>
  )
}