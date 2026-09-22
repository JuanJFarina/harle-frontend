import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Qué bueno verte"
      title="Volvé a tu espacio."
      description="Ingresá para administrar tu cuenta, tus finanzas y tu agenda."
    >
      <AuthForm mode="login" />
      <p className="auth-switch">
        ¿Todavía no tenés cuenta? <Link href="/registro">Registrate gratis</Link>
      </p>
    </AuthShell>
  );
}
