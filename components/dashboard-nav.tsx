"use client";

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Settings,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/panel",
    label: "Mi cuenta",
    icon: LayoutDashboard,
  },
  {
    href: "/panel/finanzas",
    label: "Finanzas",
    icon: WalletCards,
  },
  {
    href: "/panel/eventos",
    label: "Eventos",
    icon: CalendarDays,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="dashboard-nav" aria-label="Panel de usuario">
      <span className="nav-group-label">Tu espacio</span>
      {items.map((item) => {
        const active =
          item.href === "/panel"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            href={item.href}
            className={active ? "active" : ""}
            key={item.href}
          >
            <Icon size={19} />
            {item.label}
          </Link>
        );
      })}
      <span className="nav-group-label secondary">Preferencias</span>
      <button type="button">
        <Settings size={19} />
        Configuración
      </button>
      <Link href="/" className="nav-exit">
        <LogOut size={19} />
        Salir de la demo
      </Link>
    </nav>
  );
}
