import type { Metadata } from "next";
import { AccountPanel } from "@/components/account-panel";

export const metadata: Metadata = {
  title: "Mi cuenta",
};

export default function AccountPage() {
  return <AccountPanel />;
}
