"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EventDetail = {
	id: string;
	title: string;
	type: "TECH" | "NON-TECH";
	venue: string;
	timing: string;
	registrationFee: string;
	members: string;
	theme?: string;
	rules: string[];
};

export default function EventDetailClient({ event, googleFormUrl }: { event: EventDetail; googleFormUrl: string }) {
	if (!event) {
		return (
			<main className="mx-auto max-w-6xl px-4 py-12">
				<p className="text-muted-foreground">Loading event...</p>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-6xl px-4 py-12">
			<div className="mb-6 flex items-center gap-3">
				<h1 className="text-3xl font-bold">{event.title}</h1>
				<Badge variant={event.type === "TECH" ? "outline" : "secondary"}>{event.type}</Badge>
			</div>

			<div className="grid gap-8 md:grid-cols-3">
				<div className="space-y-4 md:col-span-2">
					<h2 className="text-xl font-semibold">Overview</h2>
					<ul className="text-sm text-muted-foreground">
						<li>
							<strong className="text-foreground">Venue:</strong> {event.venue}
						</li>
						<li>
							<strong className="text-foreground">Timing:</strong> {event.timing}
						</li>
						<li>
							<strong className="text-foreground">Registration Fee:</strong> {event.registrationFee}
						</li>
						<li>
							<strong className="text-foreground">Members:</strong> {event.members}
						</li>
						{event.theme ? (
							<li>
								<strong className="text-foreground">Theme:</strong> {event.theme}
							</li>
						) : null}
					</ul>

					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Rules</h3>
						<ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
							{event.rules.map((r, i) => (
								<li key={i}>{r}</li>
							))}
						</ol>
					</div>
				</div>

				<aside className="space-y-4">
					<Link
						href={`${googleFormUrl}?event=${encodeURIComponent(event.title)}`}
						target="_blank"
						rel="noopener noreferrer"
					>
			
						<Button className="w-full rounded-full bg-[#b97a56] text-white hover:bg-[#a86a48] dark:bg-[#7c3aed] dark:hover:bg-[#6d28d9] dark:text-white transition-colors">
							Register for {event.title}
						</Button>
					</Link>
					<div className="mt-3" />
					<Link href="/events">
						<Button variant="outline" className="w-full rounded-full bg-transparent">
							Back to Events
						</Button>
					</Link>
				</aside>
			</div>
		</main>
	);
}
