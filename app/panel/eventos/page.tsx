import type { Metadata } from "next";
import { EventsPanel } from "@/components/events-panel";

export const metadata: Metadata = {
  title: "Eventos",
};

export default function EventsPage() {
  return <EventsPanel />;
}
