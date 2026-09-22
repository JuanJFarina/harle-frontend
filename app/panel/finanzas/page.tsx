import type { Metadata } from "next";
import { FinancePanel } from "@/components/finance-panel";

export const metadata: Metadata = {
  title: "Finanzas",
};

export default function FinancesPage() {
  return <FinancePanel />;
}
