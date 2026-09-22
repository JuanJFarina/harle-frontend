import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tu compañero de IA",
    template: "%s · Tu compañero de IA",
  },
  description:
    "Un compañero de IA que aprende de vos y te ayuda a organizar tu plata, tu agenda y tu día a día desde Telegram.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
