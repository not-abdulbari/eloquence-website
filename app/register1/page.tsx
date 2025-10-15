// app/register/page.tsx

"use client"
import { useState, useEffect } from "react"
import BackgroundGrid from "@/components/background-grid"
import BlurBubbles from "@/components/blur-bubbles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchSiteData } from "@/lib/fetcher"
import { SiteData, Event, TeamMember, EventRegistration } from "@/lib/types"
import { formatMembersText, parseRegistrationFee } from "@/lib/event-utils"
import QRCode from "qrcode"

// Import Lucide icons
import { User, ListChecks, Users, Wallet, CheckCircle } from 'lucide-react'

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
  })

  const [currentStep, setCurrentStep] = useState(1) // Track current step
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")

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

  const calculateTotalFee = () => {
    if (!allEvents) return 0; // Guard against allEvents not being ready
    let total = 0
    formData.eventRegistrations.forEach(registration => {
      const event = allEvents.find(e => e.id === registration.eventId)
      if (event) {
        const baseFee = parseRegistrationFee(event.registrationFee)
        total += baseFee * registration.teamSize
      }
    })
    return total
  }

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
      } else {
          setQrCodeDataUrl("") // Clear QR code if total is 0
      }
    }
    generateQRCode()
  }, [formData.eventRegistrations, siteData]) // Added siteData dependency

  if (loading) {
    return (
      <main className="relative mx-auto w-[95%] py-16">
        <BackgroundGrid />
        <BlurBubbles />
        <div className="relative z-10 text-center">
          <p className="opacity-75 text-lg sm:text-xl">Loading registration form...</p>
        </div>
      </main>
    )
  }

  if (!siteData) {
    return (
      <main className="relative mx-auto w-[95%] py-16">
        <BackgroundGrid />
        <BlurBubbles />
        <div className="relative z-10 text-center">
          <p className="opacity-75 text-lg sm:text-xl">Failed to load registration form. Please try again later.</p>
        </div>
      </main>
    )
  }

  const technicalEvents = siteData.events.filter(event => event.type === "tech")
  const nonTechnicalEvents = siteData.events.filter(event => event.type === "non-tech")
  const allEvents = siteData.events

  const handleInputChange = (field: keyof RegistrationForm, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addEventRegistration = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId)
    if (!event) return
    if (formData.eventRegistrations.some(reg => reg.eventId === eventId)) {
      alert("You are already registered for this event!")
      return
    }
    const newRegistration: EventRegistration = {
      eventId,
      teamSize: 1,
      teamMembers: [],
      maxTeamSize: event.maxMembers,
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

  const validateStep = (step: number) => {
    const errors = []
    if (step === 1) {
      if (!formData.name.trim()) errors.push("Name is required")
      if (!formData.email.trim()) errors.push("Email is required")
      if (!formData.phone.trim()) errors.push("Phone is required")
      if (!formData.rollNo.trim()) errors.push("Roll No is required")
      if (!formData.collegeName.trim()) errors.push("College Name is required")
      if (!formData.department.trim()) errors.push("Department is required")
    }
    if (step === 3) {
        formData.eventRegistrations.forEach(registration => {
            const event = allEvents.find(e => e.id === registration.eventId)
            if (!event) return

            if (registration.teamSize < event.minMembers) {
                errors.push(`${event.title}: Team size must be at least ${event.minMembers}`)
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
    }
    if (step === 5) {
        if (!formData.paymentScreenshot) {
            errors.push("Please upload the payment screenshot.")
        }
    }
    return errors
  }

  const nextStep = () => {
    const errors = validateStep(currentStep)
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
      return
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateStep(5);
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    if (!formData.paymentScreenshot) {
        alert("Payment screenshot is missing.");
        return;
    }

    setIsSubmitting(true);

    // Use FormData to send both JSON and the file
    const data = new FormData();

    // Append JSON data as strings
    data.append('mainRegistrantData', JSON.stringify({
      title: formData.title,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rollNo: formData.rollNo,
      collegeName: formData.collegeName,
      year: formData.year,
      degree: formData.degree,
      department: formData.department,
    }));
    
    data.append('eventRegistrationsData', JSON.stringify(formData.eventRegistrations.map(reg => ({
        eventId: reg.eventId,
        eventName: allEvents.find(e => e.id === reg.eventId)?.title,
        teamSize: reg.teamSize,
        teamMembers: reg.teamMembers,
    }))));

    data.append('totalAmount', calculateTotalFee().toString());
    data.append('submittedAt', new Date().toISOString());
    
    // Append the file
    data.append('paymentScreenshot', formData.paymentScreenshot);

    try {
      const response = await fetch('https://api.eloquence.in.net/api/register', {
        method: 'POST',
        body: data, // Send the FormData object
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      alert("Registration submitted successfully! We'll contact you soon.");
      
      // Reset form state on success
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
      });
      setCurrentStep(1);

    } catch (error) {
      console.error("Submission failed:", error);
      alert(`Submission failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END OF CORRECTED FUNCTION ---

  const renderStepContent = () => {
    switch (currentStep) {
        // ... (The rest of your renderStepContent function remains the same)
        // ... I've omitted it here for brevity, but you should keep your existing code.
        case 1:
        return (
          <div className="space-y-6 p-4">
            <div className="border-b border-foreground/10 pb-2">
              <h3 className="text-xl font-semibold">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title <span className="text-red-500">*</span></label>
                <select value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" required>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Enter your full name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email <span className="text-red-500">*</span></label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Enter your email address" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Enter your phone number" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Roll No / Reg No <span className="text-red-500">*</span></label>
                <input type="text" value={formData.rollNo} onChange={(e) => handleInputChange('rollNo', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Enter your roll number" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">College Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.collegeName} onChange={(e) => handleInputChange('collegeName', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Enter your college name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year <span className="text-red-500">*</span></label>
                <select value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" required>
                  <option value="I Year">I Year</option>
                  <option value="II Year">II Year</option>
                  <option value="III Year">III Year</option>
                  <option value="IV Year">IV Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Degree <span className="text-red-500">*</span></label>
                <select value={formData.degree} onChange={(e) => handleInputChange('degree', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" required>
                  <option value="Engineering">Engineering</option>
                  <option value="Arts & Science">Arts & Science</option>
                  <option value="Diploma">Diploma, Polytechnic, ITI</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Department <span className="text-red-500">*</span></label>
                <input type="text" value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Enter your department" required />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 p-4">
            <div className="border-b border-foreground/10 pb-2">
              <h3 className="text-xl font-semibold">Event Registration</h3>
            </div>
            <div className="space-y-4 p-4">
              <h4 className="text-lg font-medium text-primary">Technical Events</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Button type="button" onClick={() => addEventRegistration(event.id)} disabled={formData.eventRegistrations.some(reg => reg.eventId === event.id)} className="mt-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors self-start">
                      {formData.eventRegistrations.some(reg => reg.eventId === event.id) ? "Added" : "Add"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 p-4">
              <h4 className="text-lg font-medium text-primary">Non-Technical Events</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Button type="button" onClick={() => addEventRegistration(event.id)} disabled={formData.eventRegistrations.some(reg => reg.eventId === event.id)} className="mt-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors self-start">
                      {formData.eventRegistrations.some(reg => reg.eventId === event.id) ? "Added" : "Add"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <>
            {formData.eventRegistrations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No events selected. Go back to Step 2 to add events.</p>
              </div>
            ) : (
              formData.eventRegistrations.map((registration) => {
                const event = allEvents.find(e => e.id === registration.eventId)
                if (!event) return null
                return (
                  <Card key={registration.eventId} className="border-foreground/10 bg-background/50 backdrop-blur-sm m-4 mt-5">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center justify-between mt-5">
                        {event.title}
                        <Button type="button" variant="outline" size="sm" onClick={() => removeEventRegistration(registration.eventId)} className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                          Remove
                        </Button>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{event.timing} • {event.registrationFee}</p>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Team Size (including you) <span className="text-red-500">*</span></label>
                        <select value={registration.teamSize} onChange={(e) => updateEventTeamSize(registration.eventId, parseInt(e.target.value))} className="w-full p-3 mb-5 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors">
                          {Array.from({ length: event.maxMembers }, (_, i) => i + 1).map(size => (
                            <option key={size} value={size}>{size} member{size > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      {registration.teamSize > 1 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">Team Members ({registration.teamMembers.length}/{registration.teamSize - 1})</h5>
                            <Button type="button" variant="outline" size="sm" onClick={() => addTeamMemberToEvent(registration.eventId)} disabled={registration.teamMembers.length >= registration.teamSize - 1} className="rounded-full border-foreground/10 hover:bg-background/80 transition-colors">
                              Add Member
                            </Button>
                          </div>
                          {registration.teamMembers.map((member, index) => (
                            <Card key={member.id} className="mb-4 border-foreground/10 bg-background/50 backdrop-blur-sm">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h6 className="font-medium">Team Member {index + 1}</h6>
                                  <Button type="button" variant="outline" size="sm" onClick={() => removeTeamMemberFromEvent(registration.eventId, member.id)} className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                                    Remove
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Title</label>
                                    <select value={member.title} onChange={(e) => updateTeamMember(registration.eventId, member.id, 'title', e.target.value)} className="w-full p-2 border border-foreground/10 rounded text-xs bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors">
                                      <option value="Mr.">Mr.</option>
                                      <option value="Mrs.">Mrs.</option>
                                      <option value="Ms.">Ms.</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Name <span className="text-red-500">*</span></label>
                                    <input type="text" value={member.name} onChange={(e) => updateTeamMember(registration.eventId, member.id, 'name', e.target.value)} className="w-full p-2 border border-foreground/10 rounded text-xs bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Full name" required />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Email <span className="text-red-500">*</span></label>
                                    <input type="email" value={member.email} onChange={(e) => updateTeamMember(registration.eventId, member.id, 'email', e.target.value)} className="w-full p-2 border border-foreground/10 rounded text-xs bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Email address" required />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                                    <input type="tel" value={member.phone} onChange={(e) => updateTeamMember(registration.eventId, member.id, 'phone', e.target.value)} className="w-full p-2 border border-foreground/10 rounded text-xs bg-background/50 backdrop-blur-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors" placeholder="Phone number" required />
                                  </div>
                                </div>
                                {registration.teamSize > 1 && (
                                  <div className="flex flex-col space-y-2 mt-3">
                                    <label className="flex items-center text-sm">
                                      <input type="checkbox" checked={member.isTeamLead} onChange={(e) => {
                                        registration.teamMembers.forEach(otherMember => { if (otherMember.id !== member.id) { updateTeamMember(registration.eventId, otherMember.id, 'isTeamLead', false) } })
                                        updateTeamMember(registration.eventId, member.id, 'isTeamLead', e.target.checked)
                                      }} className="mr-2" />
                                      Team Lead
                                    </label>
                                    {registration.teamSize > 2 && (
                                      <label className="flex items-center text-sm">
                                        <input type="checkbox" checked={member.isAlternateContact} onChange={(e) => {
                                          registration.teamMembers.forEach(otherMember => { if (otherMember.id !== member.id) { updateTeamMember(registration.eventId, otherMember.id, 'isAlternateContact', false) } })
                                          updateTeamMember(registration.eventId, member.id, 'isAlternateContact', e.target.checked)
                                        }} className="mr-2" />
                                        Alternate Contact
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
              })
            )}
          </>
        );
      case 4:
        return (
          <div className="space-y-6 p-4">
            <div className="border-b border-foreground/10 pb-2">
              <h3 className="text-xl font-semibold">Payment Information</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-medium text-foreground mb-3">Scan to Pay</h4>
                  {qrCodeDataUrl ? (
                    <div className="inline-block p-4 bg-white rounded-lg border border-foreground/10">
                      <img src={qrCodeDataUrl} alt="UPI Payment QR Code" className="w-48 h-48 mx-auto" onClick={() => { window.open(`upi://pay?pa=abdulbari250305@oksbi&am=${calculateTotalFee().toFixed(2)}`, '_blank') }} style={{ cursor: 'pointer' }} />
                      <p className="text-sm text-muted-foreground mt-2">Click QR to open UPI app</p>
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto">
                      <p className="text-sm text-muted-foreground text-center">Select an event to see payment details.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
                  <h4 className="font-medium text-foreground mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>UPI ID:</strong> abdulbari250305@oksbi</p>
                    <p><strong>UPI Number:</strong> +91 95972 25564</p>
                  </div>
                </div>
                <div className="p-6 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
                  <h4 className="font-medium text-foreground mb-4">Payment Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-foreground/20">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="border border-foreground/20 p-3 text-left text-sm font-medium">Item</th>
                          <th className="border border-foreground/20 p-3 text-center text-sm font-medium">Qty</th>
                          <th className="border border-foreground/20 p-3 text-right text-sm font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.eventRegistrations.map((registration) => {
                          const event = allEvents.find(e => e.id === registration.eventId)
                          if (!event) return null
                          const baseFee = parseRegistrationFee(event.registrationFee)
                          const totalEventFee = baseFee * registration.teamSize
                          return (
                            <tr key={registration.eventId}>
                              <td className="border border-foreground/20 p-3 text-sm">{event.title}</td>
                              <td className="border border-foreground/20 p-3 text-center text-sm">{registration.teamSize}</td>
                              <td className="border border-foreground/20 p-3 text-right text-sm">₹{totalEventFee.toFixed(2)}</td>
                            </tr>
                          )
                        })}
                        <tr className="bg-muted/30 font-bold">
                          <td colSpan={2} className="border border-foreground/20 p-3 text-right">Total</td>
                          <td className="border border-foreground/20 p-3 text-right">₹{calculateTotalFee().toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">* Payment is per team, not per person.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 p-4">
            <div className="border-b border-foreground/10 pb-2">
              <h3 className="text-xl font-semibold">Confirm & Submit</h3>
            </div>
            <div className="p-4 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
              <label className="block text-sm font-medium mb-3 text-foreground">Upload Payment Screenshot <span className="text-red-500">*</span></label>
              <input type="file" accept="image/*" onChange={(e) => handleInputChange('paymentScreenshot', e.target.files?.[0] || null)} className="w-full p-3 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" required />
              <p className="text-sm text-muted-foreground mt-2">Supported formats: JPG, PNG.</p>
            </div>
            <div className="p-6 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Contact for Queries</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center"><p className="font-medium text-foreground">Jaya Suryaa</p><p className="text-muted-foreground">+91 93441 47861</p></div>
                <div className="text-center"><p className="font-medium text-foreground">Veshal P</p><p className="text-muted-foreground">+91 73058 68148</p></div>
                <div className="text-center"><p className="font-medium text-foreground">Abdul Bari</p><p className="text-muted-foreground">+91 95972 25564</p></div>
              </div>
            </div>
          </div>
        );
        default:
            return null;
    }
  }

  const steps = [
    { label: "Personal", icon: User, step: 1 },
    { label: "Events", icon: ListChecks, step: 2 },
    { label: "Team", icon: Users, step: 3 },
    { label: "Payment", icon: Wallet, step: 4 },
    { label: "Confirm", icon: CheckCircle, step: 5 }
  ];

  return (
    <main className="relative min-h-screen w-full mx-auto">
      <BackgroundGrid />
      <BlurBubbles />
      <div className="relative z-10 w-full mx-auto">
        <div className="text-center pt-10 pb-8 px-4">
             <h1
                className="text-balance font-black leading-tight tracking-tight whitespace-nowrap mb-2"
                style={{
                  fontFamily: 'Decaydence',
                  letterSpacing: '0.07em',
                  fontSize: 'clamp(28px, 7vw, 72px)',
                  lineHeight: 1.0,
                  textAlign: 'center',
                }}
              >
                {siteData?.symposium || "ELOQUENCE'25"}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-2">
                National Level Technical Symposium
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
                {siteData?.department || 'Department of Computer Science Engineering'}<br />
                {siteData?.college || 'C. Abdul Hakeem College of Engineering & Technology'}
            </p>
            <Badge variant="outline" className="mt-4 border-foreground/10 bg-background/70 text-xs sm:text-sm px-3 py-1.5 rounded-full mx-auto flex w-fit">
                📅 November 1, 2025 | 🕘 9:00 AM - 5:00 PM
            </Badge>
        </div>

        {checkForScheduleConflicts().length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 px-4">
            <Card className="border-orange-200 bg-orange-50/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-600 text-xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-2">Schedule Conflict Warning</h3>
                    <p className="text-orange-700 text-sm mb-3">You have selected events with overlapping schedules. Participation is at your own risk.</p>
                    <ul className="text-orange-700 text-sm space-y-1 list-disc list-inside">
                      {checkForScheduleConflicts().map((conflict, index) => (
                        <li key={index}>{conflict.event1} & {conflict.event2} ({conflict.timing})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 pb-12">
          <Card className="border-foreground/10 bg-background/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold mt-5">Registration Form</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">* Indicates required field</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-8">
              {/* --- NEW VIDEO PLAYER STYLE PROGRESS BAR --- */}
              <div className="mb-12 pt-6">
                <div className="relative">
                  <div className="absolute top-6 left-6 right-6 h-1 -translate-y-1/2">
                    <div className="w-full h-full bg-foreground/10 rounded-full" />
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    {steps.map(({ label, icon: Icon, step }) => (
                      <div key={step} className="z-10 flex flex-col items-center w-12">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                          ${currentStep > step ? 'bg-primary text-primary-foreground' : ''}
                          ${currentStep === step ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/30' : ''}
                          ${currentStep < step ? 'bg-background border-2 border-foreground/20 text-muted-foreground' : ''}
                        `}>
                          <Icon size={24} />
                        </div>
                        <span className={`
                          mt-2 text-xs text-center font-semibold transition-colors duration-300
                          ${currentStep >= step ? 'text-primary' : 'text-muted-foreground'}
                        `}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* --- END OF PROGRESS BAR --- */}

              <form onSubmit={handleSubmit} className="space-y-8 mb-5">
                {renderStepContent()}
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-full">Back</Button>
                  {currentStep < 5 ? (
                    <Button type="button" onClick={nextStep} className="rounded-full">Next</Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting || formData.eventRegistrations.length === 0} className="rounded-full">
                      {isSubmitting ? "Submitting..." : "Submit Registration"}
                    </Button>
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