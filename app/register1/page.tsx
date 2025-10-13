"use client"
import { useState, useEffect } from "react"
import BackgroundGrid from "@/components/background-grid"
import BlurBubbles from "@/components/blur-bubbles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchSiteData } from "@/lib/fetcher"
import { SiteData, Event, TeamMember, EventRegistration } from "@/lib/types"
import { formatMembersText, parseRegistrationFee, checkScheduleConflicts } from "@/lib/event-utils"
import QRCode from "qrcode"

interface EventRegistration {
  eventId: string
  teamSize: number
  teamMembers: TeamMember[]
  maxTeamSize: number
  // Remove the includeFood flag
  // Add a field to potentially track food allocation per event if needed later (optional for now)
  // selectedFoodItems: number // Initially 0 for each event
}

interface RegistrationForm {
  title: string
  name: string
  email: string
  phone: string
  rollNo: string
  collegeName: string
  year: string
  degree: string
  department: string
  eventRegistrations: EventRegistration[]
  paymentScreenshot: File | null
  // Add state for total food items selected
  totalFoodItems: number // New field in the form state
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegistrationForm>({
    title: "Mr.",
    name: "",
    email: "",
    phone: "",
    rollNo: "",
    collegeName: "",
    year: "I Year",
    degree: "Engineering",
    department: "",
    eventRegistrations: [],
    paymentScreenshot: null,
    totalFoodItems: 0 // Initialize total food items to 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  // const [totalFoodItems, setTotalFoodItems] = useState(0) // State is now in formData

  // Load site data on component mount
  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const data = await fetchSiteData()
        setSiteData(data)
      } catch (error) {
        console.error('Failed to load site data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSiteData()
  }, [])

  // Generate QR code when total amount changes
  useEffect(() => {
    const generateQRCode = async () => {
      const totalAmount = calculateTotalFee()
      if (totalAmount > 0) {
        try {
          const upiUrl = `upi://pay?pa=abdulbari250305@oksbi&am=${totalAmount.toFixed(2)}`
          const qrDataUrl = await QRCode.toDataURL(upiUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
          setQrCodeDataUrl(qrDataUrl)
        } catch (error) {
          console.error('Failed to generate QR code:', error)
        }
      }
    }
    generateQRCode()
  }, [formData.eventRegistrations, formData.totalFoodItems]) // Add totalFoodItems to dependency

  // Calculate total food items from the formData state
  // This useEffect is no longer needed if totalFoodItems is managed directly in formData
  // useEffect(() => {
  //   const foodCount = formData.eventRegistrations.reduce((count, reg) => count + (reg.selectedFoodItems || 0), 0)
  //   setTotalFoodItems(foodCount) // This line would be removed if using formData.totalFoodItems
  // }, [formData.eventRegistrations])

  if (loading) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-16">
        <BackgroundGrid />
        <BlurBubbles />
        <div className="relative z-10 text-center">
          <p className="opacity-75">Loading registration form...</p>
        </div>
      </main>
    )
  }

  if (!siteData) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-16">
        <BackgroundGrid />
        <BlurBubbles />
        <div className="relative z-10 text-center">
          <p className="opacity-75">Failed to load registration form. Please try again later.</p>
        </div>
      </main>
    )
  }

  const technicalEvents = siteData.events.filter(event => event.type === "tech")
  const nonTechnicalEvents = siteData.events.filter(event => event.type === "non-tech")
  const allEvents = siteData.events

  const handleInputChange = (field: keyof RegistrationForm, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addEventRegistration = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId)
    if (!event) return

    // Check if already registered for this event
    if (formData.eventRegistrations.some(reg => reg.eventId === eventId)) {
      alert("You are already registered for this event!")
      return
    }

    const newRegistration: EventRegistration = {
      eventId,
      teamSize: 1,
      teamMembers: [],
      maxTeamSize: event.maxMembers,
      // selectedFoodItems: 0 // Initialize food items for the new event
    }

    setFormData(prev => ({
      ...prev,
      eventRegistrations: [...prev.eventRegistrations, newRegistration]
    }))
  }

  const removeEventRegistration = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      eventRegistrations: prev.eventRegistrations.filter(reg => reg.eventId !== eventId)
    }))
  }

  const updateEventTeamSize = (eventId: string, teamSize: number) => {
    const event = allEvents.find(e => e.id === eventId)
    if (!event || teamSize > event.maxMembers || teamSize < event.minMembers) return

    setFormData(prev => ({
      ...prev,
      eventRegistrations: prev.eventRegistrations.map(reg =>
        reg.eventId === eventId ? { ...reg, teamSize } : reg
      )
    }))
  }

  const addTeamMemberToEvent = (eventId: string) => {
    const registration = formData.eventRegistrations.find(reg => reg.eventId === eventId)
    if (!registration) return

    if (registration.teamMembers.length >= registration.teamSize - 1) {
      alert(`Maximum team members for this event: ${registration.teamSize - 1}`)
      return
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      title: "Mr.",
      name: "",
      email: "",
      phone: "",
      rollNo: "",
      collegeName: formData.collegeName,
      year: "I Year",
      degree: "Engineering",
      department: formData.department,
      isTeamLead: false,
      isAlternateContact: false
    }

    setFormData(prev => ({
      ...prev,
      eventRegistrations: prev.eventRegistrations.map(reg =>
        reg.eventId === eventId
          ? { ...reg, teamMembers: [...reg.teamMembers, newMember] }
          : reg
      )
    }))
  }

  const removeTeamMemberFromEvent = (eventId: string, memberId: string) => {
    setFormData(prev => ({
      ...prev,
      eventRegistrations: prev.eventRegistrations.map(reg =>
        reg.eventId === eventId
          ? { ...reg, teamMembers: reg.teamMembers.filter(member => member.id !== memberId) }
          : reg
      )
    }))
  }

  const updateTeamMember = (eventId: string, memberId: string, field: keyof TeamMember, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      eventRegistrations: prev.eventRegistrations.map(reg =>
        reg.eventId === eventId
          ? {
              ...reg,
              teamMembers: reg.teamMembers.map(member =>
                member.id === memberId ? { ...member, [field]: value } : member
              )
            }
          : reg
      )
    }))
  }

  // Function to update the total number of food items selected
  const handleTotalFoodChange = (newTotal: number) => {
    // Ensure the new total doesn't exceed 4
    if (newTotal >= 0 && newTotal <= 4) {
      setFormData(prev => ({
        ...prev,
        totalFoodItems: newTotal
      }))
    }
  }

  // Function to distribute food items across events (simplest: distribute evenly or add to first available)
  // For this implementation, we just track the total, distribution happens during calculation/payment display
  // This function is not strictly needed if only tracking the total, but could be useful if distributing per event.
  // const distributeFoodItems = (total: number): EventRegistration[] => {
  //   // Logic to assign 'total' food items across events in formData.eventRegistrations
  //   // Could prioritize based on order added, or allow user to assign per event later.
  //   // For now, we just track the total and show it in the summary/payment section.
  //   return formData.eventRegistrations.map((reg, index) => ({
  //     ...reg,
  //     selectedFoodItems: index < total ? 1 : 0 // Example: give 1 food item to first 'total' events
  //   }))
  // }

  const checkForScheduleConflicts = () => {
    const conflicts = []
    const registrations = formData.eventRegistrations

    for (let i = 0; i < registrations.length; i++) {
      for (let j = i + 1; j < registrations.length; j++) {
        const event1 = allEvents.find(e => e.id === registrations[i].eventId)
        const event2 = allEvents.find(e => e.id === registrations[j].eventId)

        if (event1 && event2 && event1.timing === event2.timing) {
          conflicts.push({
            event1: event1.title,
            event2: event2.title,
            timing: event1.timing
          })
        }
      }
    }

    return conflicts
  }

  const calculateTotalFee = () => {
    let total = 0
    let foodCost = 0

    // Calculate event fees based on team size
    formData.eventRegistrations.forEach(registration => {
      const event = allEvents.find(e => e.id === registration.eventId)
      if (event) {
        const baseFee = parseRegistrationFee(event.registrationFee)
        total += baseFee * registration.teamSize
        // Food cost calculation is now based on totalFoodItems
      }
    })

    // Calculate food cost based on totalFoodItems
    foodCost = formData.totalFoodItems * 100 // 100 per food item, total count is formData.totalFoodItems

    return total + foodCost
  }

  // ... (validateForm remains largely the same, but update validation if needed)
  const validateForm = () => {
    const errors = []

    // Check for schedule conflicts
    const conflicts = checkForScheduleConflicts()
    if (conflicts.length > 0) {
      errors.push(`Schedule conflicts detected: ${conflicts.map(c => `${c.event1} & ${c.event2}`).join(', ')}`)
    }

    // Validate team member requirements (unchanged)
    formData.eventRegistrations.forEach(registration => {
      const event = allEvents.find(e => e.id === registration.eventId)
      if (!event) return

      if (registration.teamSize < 1) {
        errors.push(`${event.title}: Team size must be at least 1`)
      }
      if (registration.teamSize > event.maxMembers) {
        errors.push(`${event.title}: Team size cannot exceed ${event.maxMembers} members`)
      }
      if (registration.teamMembers.length !== registration.teamSize - 1) {
        errors.push(`${event.title}: Please add ${registration.teamSize - 1} team member(s)`)
      }

      const hasTeamLead = registration.teamMembers.some(member => member.isTeamLead)
      const hasAlternateContact = registration.teamMembers.some(member => member.isAlternateContact)
      if (registration.teamSize > 1 && !hasTeamLead) {
        errors.push(`${event.title}: Please select a team lead`)
      }
      if (registration.teamSize > 2 && !hasAlternateContact) {
        errors.push(`${event.title}: Please select an alternate contact for teams with 3+ members`)
      }

      registration.teamMembers.forEach(member => {
        if (!member.name.trim()) {
          errors.push(`${event.title}: All team members must have names`)
        }
        if (!member.email.trim()) {
          errors.push(`${event.title}: All team members must have email addresses`)
        }
        if (!member.phone.trim()) {
          errors.push(`${event.title}: All team members must have phone numbers`)
        }
      })
    })

    // Add validation for food limit if needed elsewhere, though UI prevents exceeding 4
    // if (formData.totalFoodItems > 4) {
    //   errors.push("Maximum 4 food items allowed in total.")
    // }

    return errors
  }

  // ... (handleSubmit remains largely the same, update submission data if needed)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateForm()
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
      return
    }

    setIsSubmitting(true)

    // Prepare submission data
    const submissionData = {
      mainRegistrant: {
        title: formData.title,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        rollNo: formData.rollNo,
        collegeName: formData.collegeName,
        year: formData.year,
        degree: formData.degree,
        department: formData.department
      },
      eventRegistrations: formData.eventRegistrations.map(reg => ({
        eventId: reg.eventId,
        eventName: allEvents.find(e => e.id === reg.eventId)?.title,
        teamSize: reg.teamSize,
        teamMembers: reg.teamMembers,
        registrationFee: allEvents.find(e => e.id === reg.eventId)?.registrationFee,
        // Include the total food items selected
        totalFoodItemsSelected: formData.totalFoodItems,
        isNonTechnical: nonTechnicalEvents.some(e => e.id === reg.eventId)
      })),
      totalAmount: calculateTotalFee(),
      totalFoodItems: formData.totalFoodItems, // Add total food items to submission
      paymentScreenshot: formData.paymentScreenshot?.name || "No file uploaded",
      submittedAt: new Date().toISOString()
    }
    console.log("Registration Data:", JSON.stringify(submissionData, null, 2))

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert("Registration submitted successfully! We'll contact you soon.")
    setIsSubmitting(false)

    // Reset form
    setFormData({
      title: "Mr.",
      name: "",
      email: "",
      phone: "",
      rollNo: "",
      collegeName: "",
      year: "I Year",
      degree: "Engineering",
      department: "",
      eventRegistrations: [],
      paymentScreenshot: null,
      totalFoodItems: 0 // Reset total food items
    })
  }

  // ... (return statement JSX - the main changes are here)

  return (
    <main className="relative min-h-screen">
      <BackgroundGrid />
      <BlurBubbles />
      <div className="relative z-10 w-full m-4">
        {/* Header */}
        <div className="text-center pt-20 pb-8 px-4 p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider" style={{
            fontFamily: 'Decaydence',
            letterSpacing: '0.07em',
            fontSize: 'clamp(24px, 6vw, 64px)',
            lineHeight: 1.0,
          }}>
            {siteData?.symposium || 'ELOQUENCE \'25'}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            National Level Technical Symposium
          </p>
          <p className="text-sm text-muted-foreground">
            {siteData?.department}<br />
            {siteData?.college}
          </p>
          <Badge variant="outline" className="mt-4 border-foreground/10 bg-background/70">
            📅 November 1, 2025 | 🕘 9:00 AM - 5:00 PM
          </Badge>
        </div>
        {/* Schedule Conflicts Warning */}
        {checkForScheduleConflicts().length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 px-4 p-4">
            <Card className="border-orange-200 bg-orange-50/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-600 text-xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-2">Schedule Conflict Warning</h3>
                    <p className="text-orange-700 text-sm mb-3">
                      You have selected events with overlapping schedules. Participation is at your own risk and no refunds will be provided.
                    </p>
                    <ul className="text-orange-700 text-sm space-y-1 list-disc list-inside">
                      {checkForScheduleConflicts().map((conflict, index) => (
                        <li key={index}>
                          {conflict.event1} & {conflict.event2} ({conflict.timing})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Registration Form */}
        <div className="max-w-4xl mx-auto px-4 pb-12 p-4 ">
          <Card className="border-foreground/10 bg-background/70 backdrop-blur-sm m-4">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold mt-5">Registration Form</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                * Indicates required field
              </p>
            </CardHeader>
            <CardContent className="px-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6 p-4">
                  <div className="border-b border-foreground/10 pb-2">
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        required
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Roll No / Reg No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.rollNo}
                        onChange={(e) => handleInputChange('rollNo', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        placeholder="Enter your roll number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        College Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => handleInputChange('collegeName', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        placeholder="Enter your college name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Year (For Student) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        required
                      >
                        <option value="I Year">I Year</option>
                        <option value="II Year">II Year</option>
                        <option value="III Year">III Year</option>
                        <option value="IV Year">IV Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select your Degree <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.degree}
                        onChange={(e) => handleInputChange('degree', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        required
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Arts & Science">Arts & Science</option>
                        <option value="Diploma">Diploma, Polytechnic, ITI</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        placeholder="Enter your department"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Event Selection */}
                <div className="space-y-8 p-4">
                  <div className="border-b border-foreground/10 pb-2">
                    <h3 className="text-xl font-semibold">Event Registration</h3>
                  </div>
                  {/* Technical Events */}
                  <div className="space-y-4 p-4">
                    <h4 className="text-lg font-medium text-primary">Technical Events</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      {technicalEvents.map((event) => (
                        <div key={event.id} className="flex flex-col p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground">{event.title}</h5>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="block">{event.registrationFee}</span>
                              <span className="block">{formatMembersText(event.minMembers, event.maxMembers)}</span>
                              <span className="block">{event.timing}</span>
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => addEventRegistration(event.id)}
                            disabled={formData.eventRegistrations.some(reg => reg.eventId === event.id)}
                            className="mt-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors self-start"
                          >
                            {formData.eventRegistrations.some(reg => reg.eventId === event.id) ? "Added" : "Add"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Non-Technical Events */}
                  <div className="space-y-4 p-4">
                    <h4 className="text-lg font-medium text-primary">Non-Technical Events</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      {nonTechnicalEvents.map((event) => (
                        <div key={event.id} className="flex flex-col p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground">{event.title}</h5>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="block">{event.registrationFee}</span>
                              <span className="block">{formatMembersText(event.minMembers, event.maxMembers)}</span>
                              <span className="block">{event.timing}</span>
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => addEventRegistration(event.id)}
                            disabled={formData.eventRegistrations.some(reg => reg.eventId === event.id)}
                            className="mt-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors self-start"
                          >
                            {formData.eventRegistrations.some(reg => reg.eventId === event.id) ? "Added" : "Add"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Team Configuration for Each Event */}
                {formData.eventRegistrations.map((registration) => {
                  const event = allEvents.find(e => e.id === registration.eventId)
                  if (!event) return null
                  return (
                    <Card key={registration.eventId} className="border-foreground/10 bg-background/50 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center justify-between">
                          {event.title}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEventRegistration(registration.eventId)}
                            className="mt-5 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </Button>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {event.timing} • {event.registrationFee}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6 px-6">
                        {/* Team Size Selection */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Team Size (including you) <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={registration.teamSize}
                            onChange={(e) => updateEventTeamSize(registration.eventId, parseInt(e.target.value))}
                            className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                          >
                            {Array.from({ length: event.maxMembers }, (_, i) => i + 1).map(size => (
                              <option key={size} value={size}>{size} member{size > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                        {/* Food Option - REMOVED from here */}
                        {/* <div className="p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm mb-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-foreground">Food Option</h5>
                              <p className="text-sm text-muted-foreground">
                                Include food for this event (+₹100) • {totalFoodItems}/4 used
                              </p>
                            </div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={registration.includeFood}
                                onChange={() => toggleFoodOption(registration.eventId)}
                                disabled={!registration.includeFood && totalFoodItems >= 4}
                                className="w-4 h-4 text-primary focus:ring-primary/50 border-foreground/20 rounded disabled:opacity-50"
                              />
                              <span className="ml-2 text-sm font-medium text-foreground">
                                {registration.includeFood ? 'Opted In' : 'Opt In'}
                              </span>
                            </label>
                          </div>
                        </div> */}
                        {/* Team Members */}
                        {registration.teamSize > 1 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium">Team Members ({registration.teamMembers.length}/{registration.teamSize - 1})</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addTeamMemberToEvent(registration.eventId)}
                                disabled={registration.teamMembers.length >= registration.teamSize - 1}
                                className="rounded-full border-foreground/10 hover:bg-background/80 transition-colors"
                              >
                                Add Member
                              </Button>
                            </div>
                            {registration.teamMembers.map((member, index) => (
                              <Card key={member.id} className="mb-4 border-foreground/10 bg-background/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                  <div className="flex items-center justify-between mb-3">
                                    <h6 className="font-medium">Team Member {index + 1}</h6>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeTeamMemberFromEvent(registration.eventId, member.id)}
                                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium mb-1">Title</label>
                                      <select
                                        value={member.title}
                                        onChange={(e) => updateTeamMember(registration.eventId, member.id, 'title', e.target.value)}
                                        className="w-full p-2 border border-foreground/10 rounded text-sm bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                                      >
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Ms.">Ms.</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium mb-1">Name <span className="text-red-500">*</span></label>
                                      <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => updateTeamMember(registration.eventId, member.id, 'name', e.target.value)}
                                        className="w-full p-2 border border-foreground/10 rounded text-sm bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                                        placeholder="Full name"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium mb-1">Email <span className="text-red-500">*</span></label>
                                      <input
                                        type="email"
                                        value={member.email}
                                        onChange={(e) => updateTeamMember(registration.eventId, member.id, 'email', e.target.value)}
                                        className="w-full p-2 border border-foreground/10 rounded text-sm bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                                        placeholder="Email address"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                                      <input
                                        type="tel"
                                        value={member.phone}
                                        onChange={(e) => updateTeamMember(registration.eventId, member.id, 'phone', e.target.value)}
                                        className="w-full p-2 border border-foreground/10 rounded text-sm bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                                        placeholder="Phone number"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium mb-1">Roll No <span className="text-red-500">*</span></label>
                                      <input
                                        type="text"
                                        value={member.rollNo}
                                        onChange={(e) => updateTeamMember(registration.eventId, member.id, 'rollNo', e.target.value)}
                                        className="w-full p-2 border border-foreground/10 rounded text-sm bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                                        placeholder="Roll number"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium mb-1">Year</label>
                                      <select
                                        value={member.year}
                                        onChange={(e) => updateTeamMember(registration.eventId, member.id, 'year', e.target.value)}
                                        className="w-full p-2 border border-foreground/10 rounded text-sm bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                                      >
                                        <option value="I Year">I Year</option>
                                        <option value="II Year">II Year</option>
                                        <option value="III Year">III Year</option>
                                        <option value="IV Year">IV Year</option>
                                      </select>
                                    </div>
                                  </div>
                                  {/* Team Lead and Alternate Contact Selection */}
                                  {registration.teamSize > 1 && (
                                    <div className="flex space-x-4 mt-3">
                                      <label className="flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={member.isTeamLead}
                                          onChange={(e) => {
                                            // Uncheck other team leads
                                            registration.teamMembers.forEach(otherMember => {
                                              if (otherMember.id !== member.id) {
                                                updateTeamMember(registration.eventId, otherMember.id, 'isTeamLead', false)
                                              }
                                            })
                                            updateTeamMember(registration.eventId, member.id, 'isTeamLead', e.target.checked)
                                          }}
                                          className="mr-2"
                                        />
                                        <span className="text-sm">Team Lead</span>
                                      </label>
                                      {registration.teamSize > 2 && (
                                        <label className="flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={member.isAlternateContact}
                                            onChange={(e) => {
                                              // Uncheck other alternate contacts
                                              registration.teamMembers.forEach(otherMember => {
                                                if (otherMember.id !== member.id) {
                                                  updateTeamMember(registration.eventId, otherMember.id, 'isAlternateContact', false)
                                                }
                                              })
                                              updateTeamMember(registration.eventId, member.id, 'isAlternateContact', e.target.checked)
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-sm">Alternate Contact</span>
                                        </label>
                                      )}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

                {/* NEW: Food Selection Section - Appears only if events are selected */}
                {formData.eventRegistrations.length > 0 && (
                  <div className="space-y-6 p-4">
                    <div className="border-b border-foreground/10 pb-2">
                      <h3 className="text-xl font-semibold">Food Selection</h3>
                    </div>
                    <div className="p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-medium text-foreground">Total Food Items</h5>
                          <p className="text-sm text-muted-foreground">
                            Select the total number of food items you want (max 4). Cost: ₹100 per item.
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <label htmlFor="totalFoodSelect" className="text-sm font-medium text-foreground">
                            Food Items:
                          </label>
                          <select
                            id="totalFoodSelect"
                            value={formData.totalFoodItems}
                            onChange={(e) => handleTotalFoodChange(parseInt(e.target.value))}
                            className="p-2 border border-foreground/10 rounded text-sm bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors w-24"
                          >
                            {Array.from({ length: 5 }, (_, i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Note: The total food items selected is {formData.totalFoodItems}. Maximum allowed is 4.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                {formData.eventRegistrations.length > 0 && (
                  <div className="space-y-6 p-4">
                    <div className="border-b border-foreground/10 pb-2">
                      <h3 className="text-xl font-semibold">Payment Information</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
                      {/* QR Code Section */}
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="font-medium text-foreground mb-3">Scan to Pay</h4>
                          {qrCodeDataUrl ? (
                            <div className="inline-block p-4 bg-white rounded-lg border border-foreground/10">
                              <img
                                src={qrCodeDataUrl}
                                alt="UPI Payment QR Code"
                                className="w-48 h-48 mx-auto"
                                onClick={() => {
                                  const upiUrl = `upi://pay?pa=abdulbari250305@oksbi&am=${calculateTotalFee().toFixed(2)}`
                                  window.open(upiUrl, '_blank')
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              <p className="text-xs text-muted-foreground mt-2">Click QR to open UPI app</p>
                            </div>
                          ) : (
                            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto">
                              <p className="text-sm text-muted-foreground">Generating QR Code...</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Payment Details */}
                      <div className="space-y-4">
                        <div className="p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
                          <h4 className="font-medium text-foreground mb-3">Payment Details</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>UPI ID:</strong> abdulbari250305@oksbi</p>
                            <p><strong>UPI Number:</strong> +91 95972 25564</p>
                          </div>
                        </div>
                        {/* Fee Breakdown - UPDATED to reflect food as a separate line */}
                        <div className="p-6 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
                          <h4 className="font-medium text-foreground mb-4">Payment Breakdown</h4>
                          {/* Payment Table - UPDATED */}
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-foreground/20">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="border border-foreground/20 p-3 text-left text-sm font-medium">S.No</th>
                                  <th className="border border-foreground/20 p-3 text-left text-sm font-medium">Item</th>
                                  <th className="border border-foreground/20 p-3 text-center text-sm font-medium">Qty</th>
                                  <th className="border border-foreground/20 p-3 text-center text-sm font-medium">Rate</th>
                                  <th className="border border-foreground/20 p-3 text-center text-sm font-medium">Amt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Event Fees */}
                                {formData.eventRegistrations.map((registration, index) => {
                                  const event = allEvents.find(e => e.id === registration.eventId)
                                  if (!event) return null
                                  const baseFee = parseRegistrationFee(event.registrationFee)
                                  const totalEventFee = baseFee * registration.teamSize
                                  return (
                                    <tr key={registration.eventId}>
                                      <td className="border border-foreground/20 p-3 text-sm">{index + 1}</td>
                                      <td className="border border-foreground/20 p-3 text-sm">{event.title}</td>
                                      <td className="border border-foreground/20 p-3 text-center text-sm">{registration.teamSize}</td>
                                      <td className="border border-foreground/20 p-3 text-center text-sm">₹{baseFee}</td>
                                      <td className="border border-foreground/20 p-3 text-center text-sm">₹{totalEventFee}</td>
                                    </tr>
                                  )
                                })}
                                {/* Food Costs - SINGLE LINE */}
                                {formData.totalFoodItems > 0 && (
                                  <tr>
                                    <td className="border border-foreground/20 p-3 text-sm">{formData.eventRegistrations.length + 1}</td>
                                    <td className="border border-foreground/20 p-3 text-sm">Food Items</td>
                                    <td className="border border-foreground/20 p-3 text-center text-sm">{formData.totalFoodItems}</td>
                                    <td className="border border-foreground/20 p-3 text-center text-sm">₹100</td>
                                    <td className="border border-foreground/20 p-3 text-center text-sm">₹{formData.totalFoodItems * 100}</td>
                                  </tr>
                                )}
                                {/* Total Row */}
                                <tr className="bg-muted/30">
                                  <td className="border border-foreground/20 p-3"></td>
                                  <td className="border border-foreground/20 p-3"></td>
                                  <td className="border border-foreground/20 p-3"></td>
                                  <td className="border border-foreground/20 p-3 text-center text-sm font-medium">Total</td>
                                  <td className="border border-foreground/20 p-3 text-center text-sm font-bold">₹{calculateTotalFee()}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="text-xs text-muted-foreground mt-4 space-y-1">
                            <p>* Cost per head is calculated from event registration fee</p>
                            <p>* Food cost is ₹100 per item (total selected, max 4)</p>
                            <p>* Payment is per team, not per person</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
                      <label className="block text-sm font-medium mb-3 text-foreground">
                        Upload Payment Screenshot <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange('paymentScreenshot', e.target.files?.[0] || new File([], ''))}
                        className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: JPG, PNG, GIF. Max size: 10MB
                      </p>
                    </div>
                  </div>
                )}
                {/* Contact Information */}
                <div className="p-6 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm m-4">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Contact for Queries</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-foreground">Jaya Suryaa</p>
                      <p className="text-muted-foreground">+91 93441 47861</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Veshal P</p>
                      <p className="text-muted-foreground">+91 73058 68148</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Abdul Bari</p>
                      <p className="text-muted-foreground">+91 95972 25564</p>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="text-center pt-6 p-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || formData.eventRegistrations.length === 0}
                    className="px-12 py-4 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                  {formData.eventRegistrations.length === 0 && (
                    <p className="text-sm text-red-500 mt-3">
                      Please select at least one event to register
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}