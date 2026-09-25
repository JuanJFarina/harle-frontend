import { Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { DashboardNav } from "@/components/dashboard-nav";
import {
  DashboardPlanSummary,
  DashboardSessionProvider,
  DashboardUserSummary,
} from "@/components/dashboard-session";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardSessionProvider>
      <div className="dashboard">
        <aside className="dashboard-sidebar">
          <Link href="/" className="brand-link dashboard-brand">
            <BrandMark />
          </Link>
          <DashboardNav />
          <DashboardPlanSummary />
        </aside>

        <div className="dashboard-body">
          <header className="dashboard-topbar">
            <span className="demo-badge">Panel parcialmente demo</span>
            <div className="topbar-actions">
              <button
                type="button"
                className="notification-button"
                aria-label="Notificaciones"
              >
                <Bell size={19} />
                <span />
              </button>
              <button type="button" className="profile-button">
                <DashboardUserSummary />
                <ChevronDown size={16} />
              </button>
            </div>
          </header>
          <div className="dashboard-content">{children}</div>
        </div>
      </div>
    </DashboardSessionProvider>
  );
}
