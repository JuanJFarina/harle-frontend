import { Bell, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { DashboardNav } from "@/components/dashboard-nav";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <Link href="/" className="brand-link dashboard-brand">
          <BrandMark />
        </Link>
        <DashboardNav />
        <div className="sidebar-plan">
          <span>
            <Sparkles size={15} />
            Plan Básico
          </span>
          <strong>326 de 480</strong>
          <div className="mini-progress">
            <span style={{ width: "68%" }} />
          </div>
          <small>conversaciones disponibles</small>
        </div>
      </aside>

      <div className="dashboard-body">
        <header className="dashboard-topbar">
          <span className="demo-badge">Vista de demostración</span>
          <div className="topbar-actions">
            <button type="button" className="notification-button" aria-label="Notificaciones">
              <Bell size={19} />
              <span />
            </button>
            <button type="button" className="profile-button">
              <span className="profile-avatar">JF</span>
              <span className="profile-name">
                <strong>Juan</strong>
                <small>Plan Básico</small>
              </span>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
