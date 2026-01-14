"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types";
import { formatMembersText } from "@/lib/event-utils";

export default function EventDetailClient({ event, googleFormUrl }: { event: Event; googleFormUrl?: string }) {
	if (!event) {
		return (
			<main className="mx-auto max-w-6xl px-4 py-12">
				<p className="opacity-75">Loading event...</p>
			</main>
		);
	}

	const membersText = formatMembersText(event.minMembers, event.maxMembers)

	return (
		<main className="mx-auto max-w-6xl px-4 py-12">
			<div className="mb-6 flex items-center gap-3">
				<h1 className="text-3xl font-bold">{event.title}</h1>
				
			</div>

			<div className="grid gap-8 md:grid-cols-3">
				<div className="space-y-4 md:col-span-2">
					<h2 className="text-xl font-semibold">Overview</h2>
					<ul className="text-sm opacity-75 space-y-1">
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
							<strong className="text-foreground">Members:</strong> {membersText}
						</li>
						<li>
							<strong className="text-foreground">Description:</strong> {event.short}
						</li>
					</ul>

					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Rules</h3>
						<ol className="list-decimal space-y-1 pl-5 text-sm opacity-75">
							{event.rules.map((rule, i) => (
								<li key={i}>{rule}</li>
							))}
						</ol>
					</div>

					{event.contact && (
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">Contact</h3>
							<div className="text-sm opacity-75">
								<p><strong className="text-foreground">Coordinator:</strong> {event.contact.name}</p>
								<p><strong className="text-foreground">Phone:</strong> {event.contact.phone}</p>
							</div>
						</div>
					)}
				</div>

				<aside className="space-y-4">
					<Link
						href={`/register?event=${event.id}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground transition-colors">
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