import fs from "fs";
import path from "path";
import EventDetailClient from "./EventDetailClient";
import BackgroundGrid from "@/components/background-grid";
import FloatingIcons from "@/components/floating-icons";
import BlurBubbles from "@/components/blur-bubbles";

// Type assertions for components with variant prop
const TypedBlurBubbles = BlurBubbles as React.ComponentType<{ variant?: string }>
const TypedFloatingIcons = FloatingIcons as React.ComponentType<{ variant?: string }>

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data", "site-data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data.events.map((e: { id: string }) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), "public", "data", "site-data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const event = data.events.find((e: { id: string }) => e.id === params.id);
  return {
    title: event ? `${event.title} | Eloquence'25` : "Event | Eloquence'25",
    description: event ? `Details for ${event.title} at Eloquence'25.` : "Event details."
  };
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), "public", "data", "site-data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const event = data.events.find((e: { id: string }) => e.id === params.id);
  const googleFormUrl = data.googleFormUrl;
  
  if (!event) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-12">
        <BackgroundGrid />
        <TypedBlurBubbles variant="events" />
        <TypedFloatingIcons variant="events" />
        <div className="relative z-10">
          <p className="opacity-75">Event not found.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12">
      <BackgroundGrid />
      <TypedBlurBubbles variant="events" />
      <TypedFloatingIcons variant="events" />
      <div className="relative z-10">
        <EventDetailClient event={event} googleFormUrl={googleFormUrl} />
      </div>
    </main>
  );
}