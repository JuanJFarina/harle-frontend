import { ArrowLeft, BrainCircuit, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <div className="auth-aside-glow" />
        <Link href="/" className="brand-link">
          <BrandMark />
        </Link>
        <div className="auth-pitch">
          <span className="auth-orb">
            <BrainCircuit size={38} />
          </span>
          <h2>Un compañero que se adapta a tu vida, no al revés.</h2>
          <ul>
            <li>
              <Check size={16} />
              Personalidad y frecuencia configurables
            </li>
            <li>
              <Check size={16} />
              Finanzas y agenda en un solo lugar
            </li>
            <li>
              <Check size={16} />
              Texto, audio e imágenes desde Telegram
            </li>
          </ul>
        </div>
        <div className="auth-trust">
          <ShieldCheck size={18} />
          <span>
            <strong>Tus datos son tuyos.</strong>
            Cada cuenta está aislada y bajo tu control.
          </span>
        </div>
      </section>

      <section className="auth-main">
        <div className="auth-main-inner">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <div className="auth-heading">
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
