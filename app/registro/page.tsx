import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationFlow } from "@/components/registration-flow";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

type RegisterPageProps = {
  searchParams: Promise<{
    plan?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Empezá gratis"
      title="Creá un compañero a tu medida."
      description="Abrí tu cuenta y después conectala con Telegram."
    >
      <RegistrationFlow
        mode="register"
        requestedPlan={params.plan}
      />
      <p className="auth-switch">
        ¿Ya tenés cuenta? <Link href="/ingresar">Ingresá</Link>
      </p>
    </AuthShell>
  );
}
