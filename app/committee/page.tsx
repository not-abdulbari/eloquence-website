import Image from "next/image"

const hod = { role: "Head of Department (CSE)", name: "Name Here", img: "/hod.png" }

const convenors = [
  { role: "Staff Convenor", name: "Name Here", img: "/convenor.png" },
  { role: "Staff Convenor", name: "Name Here", img: "/convenor.png" },
  { role: "Staff Convenor", name: "Name Here", img: "/convenor.png" },
]

export default function CommitteePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Committee</h1>
        <p className="text-muted-foreground">HOD and Staff Convenors of Eloquence&apos;25.</p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">HOD</h2>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-4">
            <Image src={hod.img || "/placeholder.svg"} alt={hod.role} width={120} height={120} className="rounded-md" />
            <div>
              <div className="font-medium">{hod.name}</div>
              <div className="text-sm text-muted-foreground">{hod.role}</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Staff Convenors</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {convenors.map((p, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 text-center">
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
        </div>
      </section>
    </main>
  )
}
