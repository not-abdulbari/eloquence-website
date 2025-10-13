import { Event, SiteData } from './types'

export async function getSiteData(): Promise<SiteData> {
  try {
    const response = await fetch('/data/site-data.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching site data:', error)
    throw error
  }
}

export function getEventById(events: Event[], id: string): Event | undefined {
  return events.find(event => event.id === id)
}

export function getEventsByType(events: Event[], type: "tech" | "non-tech"): Event[] {
  return events.filter(event => event.type === type)
}

export function getTechnicalEvents(events: Event[]): Event[] {
  return getEventsByType(events, "tech")
}

export function getNonTechnicalEvents(events: Event[]): Event[] {
  return getEventsByType(events, "non-tech")
}

export function formatMembersText(minMembers: number, maxMembers: number): string {
  if (minMembers === maxMembers) {
    return maxMembers === 1 ? "Individual" : `${maxMembers} per team`
  }
  return `${minMembers}-${maxMembers} per team`
}

export function parseRegistrationFee(feeString: string): number {
  // Extract number from strings like "₹50 per head", "₹200 per squad"
  const match = feeString.match(/₹(\d+)/)
  return match ? parseInt(match[1]) : 0
}

export function checkScheduleConflicts(events: Event[]): Array<{
  event1: string
  event2: string
  timing: string
}> {
  const conflicts = []
  
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (events[i].timing === events[j].timing) {
        conflicts.push({
          event1: events[i].title,
          event2: events[j].title,
          timing: events[i].timing
        })
      }
    }
  }
  
  return conflicts
}

export function getEventIcon(id: string): string {
  const iconMap: Record<string, string> = {
    // Technical Events
    "coding-debugging": "Code2",
    "paper-presentation": "FileText",
    "poster-making": "Palette",
    "tech-quiz": "Brain",
    "web-designing": "Globe",
    
    // Non-Technical Events
    "connection": "Link2",
    "cooking-without-fire": "ChefHat",
    "esports": "Gamepad2",
    "chess": "Grid3x3",
    "mehendi": "PenTool",
    "reels-photography": "Clapperboard",
    "treasure-hunt": "Compass"
  }
  
  return iconMap[id.toLowerCase()] || "Code2"
}
