// app/register1/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import FloatingIcons from "@/components/floating-icons";
import BackgroundGrid from "@/components/background-grid";

export const metadata: Metadata = {
  title: "Registration Paused | Eloquence'25",
  description: "Registration for Eloquence'25 has been temporarily paused due to Anna University Practical Examinations.",
};

export default function RegistrationPausedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <BackgroundGrid />
      <FloatingIcons variant="hero" />
      <div className="w-full max-w-2xl mx-auto text-center space-y-8 relative z-10">
        {/* Icon */}
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold">
          Registration Paused
        </h1>

        {/* Message */}
        <div className="space-y-4 text-lg">
          <p className="text-base sm:text-lg leading-relaxed mt-4">
            Due to the scheduling of <strong>Anna University Practical Examinations</strong>, we regret to inform you that 
            <strong> Eloquence'25 — the 8th National Level Technical Symposium</strong> has been postponed until further notice.
          </p>

          <p className="text-base sm:text-lg opacity-90 mt-2">
            An official circular will be released soon, and our symposium coordinators will contact all registered participants with further updates.
          </p>

          <p className="text-sm opacity-75 mt-4">
            We sincerely apologize for any inconvenience caused and appreciate your understanding.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}