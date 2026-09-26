"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import {
  cancelSubscription,
  createSubscriptionCheckout,
  getPlans,
  getSession,
  getSubscription,
  HarleApiError,
  PublicPlan,
  Subscription,
  WebSession,
} from "@/lib/harle-api";

export function SubscriptionFlow({
  requestedPlan,
}: {
  requestedPlan?: string;
}) {
  const router = useRouter();
  const [session, setSession] = useState<WebSession | null>(null);
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<HarleApiError | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.all([
      getSession(controller.signal),
      getPlans(controller.signal),
      getSubscription(controller.signal),
    ])
      .then(([currentSession, currentPlans, currentSubscription]) => {
        setSession(currentSession);
        setPlans(currentPlans);
        setSubscription(currentSubscription);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (caught instanceof HarleApiError && caught.status === 401) {
          if (requestedPlan) {
            window.sessionStorage.setItem(
              "harle_desired_plan",
              requestedPlan,
            );
          }
          router.replace(
            requestedPlan
              ? `/ingresar?plan=${requestedPlan}`
              : "/ingresar",
          );
          return;
        }
        setError(asApiError(caught));
        setLoading(false);
      });
    return () => controller.abort();
  }, [requestedPlan, router]);

  useEffect(() => {
    if (subscription?.status !== "pending") {
      return;
    }
    const controller = new AbortController();
    const timer = window.setInterval(async () => {
      try {
        setSubscription(await getSubscription(controller.signal));
      } catch (caught) {
        if (!controller.signal.aborted) {
          setError(asApiError(caught));
        }
      }
    }, 3000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [subscription?.status]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.code === requestedPlan),
    [plans, requestedPlan],
  );

  async function checkout(planCode: string) {
    if (!session) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await createSubscriptionCheckout(
        planCode,
        session.csrf_token,
      );
      window.location.assign(result.checkout_url);
    } catch (caught) {
      setError(asApiError(caught));
      setBusy(false);
    }
  }

  async function cancel() {
    if (
      !session ||
      !window.confirm(
        "No se realizarán nuevos cobros. Tu acceso continuará hasta el final del período actual.",
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setSubscription(await cancelSubscription(session.csrf_token));
    } catch (caught) {
      setError(asApiError(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="subscription-page">
      <header className="subscription-header">
        <Link href="/" className="brand-link">
          <BrandMark />
        </Link>
        <Link href="/panel" className="back-link">
          <ArrowLeft size={16} />
          Volver al panel
        </Link>
      </header>

      <section className="subscription-content">
        <div className="section-heading centered">
          <div className="eyebrow">Tu suscripción</div>
          <h1>Elegí cuánto querés usarlo.</h1>
          <p>
            Pagás de forma segura en Mercado Pago. Harle nunca recibe los datos
            de tu tarjeta.
          </p>
        </div>

        {loading && (
          <div className="subscription-state">
            <LoaderCircle className="spin" size={28} />
            <strong>Cargando tu suscripción…</strong>
          </div>
        )}

        {!loading && subscription && (
          <>
            <CurrentSubscription
              subscription={subscription}
              busy={busy}
              onCancel={() => void cancel()}
              onResume={() =>
                void checkout(
                  subscription.pending_plan?.code ?? subscription.plan.code,
                )
              }
            />
            {subscription.plan.code === "free" &&
              subscription.status === "active" && (
                <PlanSelection
                  plans={plans}
                  selectedPlan={selectedPlan?.code}
                  busy={busy}
                  onCheckout={(code) => void checkout(code)}
                />
              )}
          </>
        )}

        {error && (
          <div className="inline-api-error subscription-error" role="alert">
            <AlertCircle size={17} />
            <span>
              {error.message}
              {error.requestId && <small>Referencia: {error.requestId}</small>}
            </span>
          </div>
        )}
      </section>
    </main>
  );
}

function CurrentSubscription({
  subscription,
  busy,
  onCancel,
  onResume,
}: {
  subscription: Subscription;
  busy: boolean;
  onCancel: () => void;
  onResume: () => void;
}) {
  const isPaid =
    subscription.plan.code !== "free" || subscription.pending_plan !== null;
  const canCancel =
    isPaid &&
    ["active", "past_due", "pending"].includes(subscription.status) &&
    !subscription.cancel_at_period_end &&
    subscription.status !== "manual";

  return (
    <article className="current-subscription">
      <span className="current-subscription-icon">
        <CreditCard size={23} />
      </span>
      <div>
        <small>Plan actual</small>
        <h2>{subscription.plan.display_name}</h2>
        <p>{subscriptionMessage(subscription)}</p>
      </div>
      <div className="current-subscription-period">
        <span>{statusName(subscription.status)}</span>
        <strong>
          {formatDate(subscription.period_starts_at)} —{" "}
          {formatDate(subscription.period_ends_at)}
        </strong>
      </div>
      {subscription.status === "pending" && subscription.checkout_url && (
        <a
          href={subscription.checkout_url}
          className="button button-gold current-subscription-checkout"
        >
          Continuar pago
          <ArrowRight size={16} />
        </a>
      )}
      {subscription.status === "creating" && (
        <button
          type="button"
          className="button button-gold current-subscription-checkout"
          disabled={busy}
          onClick={onResume}
        >
          <ArrowRight size={16} />
          Reintentar checkout
        </button>
      )}
      {canCancel && (
        <button
          type="button"
          className="subscription-cancel"
          disabled={busy}
          onClick={onCancel}
        >
          <XCircle size={16} />
          Cancelar suscripción
        </button>
      )}
    </article>
  );
}

function PlanSelection({
  plans,
  selectedPlan,
  busy,
  onCheckout,
}: {
  plans: PublicPlan[];
  selectedPlan?: string;
  busy: boolean;
  onCheckout: (code: string) => void;
}) {
  return (
    <div className="subscription-plans">
      {plans
        .filter((plan) => plan.code !== "free")
        .map((plan) => (
          <article
            className={`subscription-plan ${selectedPlan === plan.code ? "selected" : ""}`}
            key={plan.code}
          >
            {selectedPlan === plan.code && (
              <span className="recommended">Elegido</span>
            )}
            <h2>{plan.display_name}</h2>
            <div className="price">
              <strong>
                $ {Number(plan.monthly_price_ars).toLocaleString("es-AR")}
              </strong>
              <span>/ mes</span>
            </div>
            <ul>
              <li>
                <Check size={16} />
                {plan.conversation_limit.toLocaleString("es-AR")} conversaciones
              </li>
              <li>
                <Check size={16} />
                {plan.notification_limit} notificaciones
              </li>
              <li>
                <ShieldCheck size={16} />
                Pago protegido por Mercado Pago
              </li>
            </ul>
            <button
              type="button"
              className="button button-gold"
              disabled={busy}
              onClick={() => onCheckout(plan.code)}
            >
              {busy ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
              Elegir {plan.display_name}
            </button>
          </article>
        ))}
    </div>
  );
}

function subscriptionMessage(subscription: Subscription): string {
  if (subscription.status === "creating") {
    return "El checkout todavía no se pudo preparar.";
  }
  if (subscription.status === "pending") {
    return `Esperando la confirmación de Mercado Pago para ${
      subscription.pending_plan?.display_name ?? "el plan elegido"
    }.`;
  }
  if (subscription.status === "past_due") {
    if (subscription.plan.code === "free") {
      return "El primer cobro fue rechazado. Conservás el plan Gratuito mientras Mercado Pago reintenta.";
    }
    return "El último cobro fue rechazado. El acceso pago está suspendido mientras Mercado Pago reintenta.";
  }
  if (subscription.cancel_at_period_end) {
    return "No habrá nuevos cobros. Conservás el acceso hasta el final del período.";
  }
  if (subscription.status === "manual") {
    return "Este plan fue provisionado manualmente y no se administra desde Mercado Pago.";
  }
  return subscription.plan.code === "free"
    ? "Podés pasar a un plan pago cuando quieras."
    : `Próximo cobro: ${subscription.next_payment_at ? formatDate(subscription.next_payment_at) : "a confirmar"}.`;
}

function statusName(status: string): string {
  const names: Record<string, string> = {
    active: "Activa",
    creating: "Preparando",
    pending: "Pendiente",
    past_due: "Pago rechazado",
    cancelled: "Cancelada",
    manual: "Manual",
  };
  return names[status] ?? status;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function asApiError(error: unknown): HarleApiError {
  return error instanceof HarleApiError
    ? error
    : new HarleApiError(
        "Ocurrió un error inesperado.",
        0,
        "unexpected_error",
      );
}
