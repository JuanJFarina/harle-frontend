import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { plans } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

type RegisterPageProps = {
  searchParams: Promise<{
    email?: string;
    nombre?: string;
    plan?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const selectedPlan =
    plans.find((plan) => plan.code === params.plan) ?? plans[0];

  return (
    <AuthShell
      eyebrow="Empezá gratis"
      title="Creá un compañero a tu medida."
      description="Abrí tu cuenta y después conectala con Telegram."
    >
      <div className="selected-plan">
        <span>
          Plan <strong>{selectedPlan.name}</strong>
        </span>
        <span>
          {selectedPlan.price === 0
            ? "Gratis"
            : `$ ${selectedPlan.price.toLocaleString("es-AR")} / mes`}
        </span>
      </div>
      <AuthForm
        mode="register"
        initialEmail={params.email}
        initialName={params.nombre}
        selectedPlan={selectedPlan.code}
      />
      <p className="auth-switch">
        ¿Ya tenés cuenta? <Link href="/ingresar">Ingresá</Link>
      </p>
    </AuthShell>
  );
}
