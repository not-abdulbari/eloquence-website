import Image from "next/image"

const people = [
  { role: "Chairman", name: "Name Here", img: "/chairman.png" },
  { role: "Correspondent", name: "Name Here", img: "/correspondent.png" },
  { role: "Vice Principal", name: "Name Here", img: "/vice-principal.png" },
  { role: "Principal", name: "Name Here", img: "/principal.png" },
]

export default function PatronsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Patrons</h1>
        <p className="text-muted-foreground">Our esteemed leadership supporting Eloquence&apos;25.</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {people.map((p) => (
          <div key={p.role} className="rounded-lg border bg-card p-4 text-center">
            <Image
              src={p.img || "/placeholder.svg"}
              alt={p.role}
              width={120}
              height={120}
              className="mx-auto rounded-md"
            />
            <div className="mt-3 font-medium">{p.name}</div>
            <div className="text-sm text-muted-foreground">{p.role}</div>
          </div>
        ))}
      </section>
    </main>
  )
}
