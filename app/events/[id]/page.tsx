
import fs from "fs";
import path from "path";
import EventDetailClient from "./EventDetailClient";


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
    return <main className="mx-auto max-w-6xl px-4 py-12"><p className="text-muted-foreground">Event not found.</p></main>;
  }
  return <EventDetailClient event={event} googleFormUrl={googleFormUrl} />;
}


