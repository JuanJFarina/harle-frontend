import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationFlow } from "@/components/registration-flow";

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
      <RegistrationFlow mode="login" />
      <p className="auth-switch">
        ¿Todavía no tenés cuenta? <Link href="/registro">Registrate gratis</Link>
      </p>
    </AuthShell>
  );
}
