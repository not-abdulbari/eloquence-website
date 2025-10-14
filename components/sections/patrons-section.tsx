import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatronsSection() {
  const patrons = [
    { role: "Chairman", name: "Janab Dr. S. Ziauddin Ahmed" },
    { role: "Correspondent", name: "Janab V. Mohamed Rizwanullah" },
    { role: "Principal", name: "Dr. M. Sasikumar" },
    { role: "Vice Principal", name: "Dr. Mohammed Muzaffar Hussain" },
    { role: "HOD - CSE", name: "Dr. K. Abrar Ahmed" },
    { role: "Staff Convenors", names: ["Mr. K.A. Suhail Ahmed", "Mrs. S. Saranya", "Mrs. A. Kalaiselvi"] }
  ]

  return (
    <section id="patrons" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-6">
        <h2 className="text-balance text-3xl font-semibold">Patrons</h2>
        <p className="text opacity-75">With guidance and support from our leadership.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patrons.map((p) => (
          <Card key={p.role} className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base mt-6">{p.role}</CardTitle>
            </CardHeader>
            <CardContent className="text opacity-75">
              {Array.isArray(p.names) ? (
                <div className="mb-6">
                 {p.names.map((name, index) => (
                    <div key={index}>{name}</div>
                  ))}
              </div>  
              ) : (
                <div className="mb-6">{p.name}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}