import type { Metadata } from "next";
import { SubscriptionFlow } from "@/components/subscription-flow";

export const metadata: Metadata = {
  title: "Suscripción",
};

type SubscriptionPageProps = {
  searchParams: Promise<{
    plan?: string;
  }>;
};

export default async function SubscriptionPage({
  searchParams,
}: SubscriptionPageProps) {
  const params = await searchParams;
  return <SubscriptionFlow requestedPlan={params.plan} />;
}
