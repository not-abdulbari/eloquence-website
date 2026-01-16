"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BackgroundGrid from "@/components/background-grid"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [eventName, setEventName] = useState("paper-presentation")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  // Check for existing session on page load
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // JWT Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("https://api.eloquence.in.net/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      })

      const result = await response.json()

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("admin_token", result.token)
        setIsAuthenticated(true)
      } else {
        alert(result.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Could not connect to the authentication server.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    setIsAuthenticated(false)
    setData([])
  }

  // API Fetch Logic using JWT Token
  const fetchRegistrations = async () => {
    setLoading(true)
    const token = localStorage.getItem("admin_token")
    
    try {
      const response = await fetch(`https://api.eloquence.in.net/api/registrations/${eventName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()

      if (response.ok) {
        setData(result)
      } else if (response.status === 401) {
        alert("Session expired. Please login again.")
        handleLogout()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Failed to fetch:", error)
      alert("Error fetching data. Ensure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <BackgroundGrid />
        <Card className="w-full max-w-md z-10 bg-background/80 backdrop-blur-md border-foreground/10">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold mt-10">Eloquence'25 Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">Admin Security Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 border rounded-lg bg-background/50 focus:ring-2 focus:ring-primary/50 text-foreground"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 mb-10 text-lg font-semibold">
                Login to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  // --- Authenticated Dashboard ---
  return (
    <main className="relative min-h-screen py-10">
      <BackgroundGrid />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <Card className="bg-background/80 backdrop-blur-md border-foreground/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b mb-6">
            <div>
              <CardTitle className="text-2xl font-bold mt-10 text-primary">Registrations Dashboard</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">C. Abdul Hakeem College of Engineering and Technology</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 hover:bg-red-50">
              Logout
            </Button>
          </CardHeader>
          
          <CardContent>
            {/* Event Selection Filters */}
            <div className="flex flex-wrap gap-4 mb-8 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Select Event</label>
                <select 
                  value={eventName} 
                  onChange={(e) => setEventName(e.target.value)}
                  className="p-3 border rounded-lg bg-background/50 min-w-[250px] focus:ring-2 focus:ring-primary/50 text-foreground"
                >
                  <optgroup label="Technical Events">
                    <option value="coding-debugging">Coding Debugging</option>
                    <option value="paper-presentation">Paper Presentation</option>
                    <option value="poster-making">Poster Making</option>
                    <option value="tech-quiz">Tech Quiz</option>
                    <option value="web-designing">Web Designing</option>
                  </optgroup>
                  <optgroup label="Non-Technical Events">
                    <option value="chess">Chess</option>
                    <option value="connection">Connections</option>
                    <option value="cooking-without-fire">Cooking Without Fire</option>
                    <option value="esports">E-Sports</option>
                    <option value="mehendi">Mehendi</option>
                    <option value="reels-photography">Reels Photography</option>
                    <option value="treasure-hunt">Treasure Hunt</option>
                  </optgroup>
                </select>
              </div>
              <Button onClick={fetchRegistrations} disabled={loading} className="h-[46px] px-8 font-bold">
                {loading ? "Fetching..." : "Fetch Data"}
              </Button>
            </div>

            {/* Registrations Table */}
            <div className="overflow-x-auto border rounded-xl shadow-sm mb-10">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 border text-center font-bold text-muted-foreground">S.No.</th>
                    <th className="p-4 border text-center font-bold text-muted-foreground">Team No</th>
                    <th className="p-4 border text-center font-bold text-muted-foreground">Size</th>
                    <th className="p-4 border font-bold text-muted-foreground">Main Registrant</th>
                    <th className="p-4 border font-bold text-muted-foreground">Participant Name</th>
                    <th className="p-4 border font-bold text-muted-foreground">College Name</th>
                    <th className="p-4 border font-bold text-muted-foreground">Phone Number</th>
                    <th className="p-4 border text-center font-bold text-muted-foreground">Screenshot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {data.length > 0 ? data.map((row: any, index: number) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 border text-center">{row["S.No."]}</td>
                      <td className="p-4 border text-center font-mono font-bold text-primary">{row["Team Number"]}</td>
                      <td className="p-4 border text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-tighter ${row["Team Size"] === 1 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {row["Team Size"] === 1 ? 'Solo' : `${row["Team Size"]}`}
                        </span>
                      </td>
                      <td className="p-4 border font-semibold">{row["Main Registrant Name"]}</td>
                      <td className="p-4 border">{row["Member Name"]}</td>
                      <td className="p-4 border text-xs italic opacity-80">{row["College Name"]}</td>
                      <td className="p-4 border font-mono">{row["Phone Number"]}</td>
                      <td className="p-4 border text-center">
                        <a 
                          href={row["Payment Screenshot"]} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-primary hover:underline font-bold"
                        >
                          View File
                        </a>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="p-16 text-center text-muted-foreground bg-muted/10">
                        {loading ? "Decrypting registration data..." : "No registrations found. Select an event to begin."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center text-xs text-muted-foreground font-medium mb-10">
              <p>Total Records: {data.length}</p>
              <p>© Eloquence'25 — CAHCET</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}