import Link from "next/link"
import Image from "next/image"

export default function SponsorsSection() {
  const sponsors = [
    { 
      alt: "Strydo", 
      src: "/strydo.webp",
      url: "https://strydoprojects.com/"
    },
    { 
      alt: "Pughzal Brownie", 
      src: "/pughzal-brownie.webp",
      url: "" // no URL provided — leave blank or omit if unknown
    },
    { 
      alt: "Waffle on Wheels", 
      src: "/waffle-n-wheels.webp",
      url: "https://www.instagram.com/waffleonwheels_official/"
    },
    { 
      alt: "Little Pirates", 
      src: "/little-pirates.webp",
      url: "https://www.instagram.com/littlepiratevellore/"
    },
    { 
      alt: "Street Kitchen", 
      src: "/street-kitchen.webp",
      url: "https://www.instagram.com/thestreetkitchen_/"
    },
    { 
      alt: "Arcot Mani Mark", 
      src: "/arcot-mani-mark.webp",
      url: "https://www.manimark.com/"
    },
    { 
      alt: "Priyum Cakes Bakes", 
      src: "/priyum-cakes-bakes.webp",
      url: "https://www.instagram.com/priyumbakery/"
    },
    { 
      alt: "Nawras Enterprises", 
      src: "/nawras-enterprises.webp",
      url: "https://www.instagram.com/nawras_groups/"
    },
  ]

  return (
    <section id="sponsors" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8">
        <h2 className="text-balance text-3xl font-semibold">Sponsors</h2>
      </div>

      <div className="grid place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.alt}
            className="relative w-full pt-[26.67%] rounded-xl border bg-card overflow-hidden"
          >
            {sponsor.url ? (
              <Link href={sponsor.url} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  fill
                  className="object-contain opacity-90 hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </Link>
            ) : (
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                fill
                className="object-contain opacity-90"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}