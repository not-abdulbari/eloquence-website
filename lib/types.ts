export interface EventContact {
  name: string
  phone: string
}

export interface Event {
  id: string
  title: string
  type: "tech" | "non-tech"
  short: string
  venue: string
  timing: string
  registrationFee: string
  minMembers: number
  maxMembers: number
  rules: string[]
  contact: EventContact
}

export interface SiteData {
  college: string
  department: string
  symposium: string
  googleFormUrl?: string
  location: {
    name: string
    address: string
    mapUrl: string
  }
  events: Event[]
}

export interface EventRegistration {
  eventId: string
  teamSize: number
  teamMembers: TeamMember[]
  maxTeamSize: number
}

export interface TeamMember {
  id: string
  title: string
  name: string
  email: string
  phone: string
  rollNo: string
  collegeName: string
  year: string
  degree: string
  department: string
  isTeamLead: boolean
  isAlternateContact: boolean
}
