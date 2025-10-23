// app/register1/page.tsx
import { notFound } from "next/navigation";

export default function RegistrationPausedPage() {
  // This will immediately trigger the global not-found page
  notFound();
}