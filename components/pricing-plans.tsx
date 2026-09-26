"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getPlans,
  HarleApiError,
  PublicPlan,
} from "@/lib/harle-api";

export function PricingPlans() {
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [error, setError] = useState<HarleApiError | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void getPlans(controller.signal)
      .then(setPlans)
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            caught instanceof HarleApiError
              ? caught
              : new HarleApiError(
                  "No pudimos cargar los planes.",
                  0,
                  "unexpected_error",
                ),
          );
        }
      });
    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <div className="pricing-load-state" role="alert">
        <strong>No pudimos cargar los planes</strong>
        <span>{error.message}</span>
        <button type="button" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="pricing-load-state" aria-live="polite">
        <LoaderCircle className="spin" size={26} />
        <strong>Cargando planes…</strong>
      </div>
    );
  }

  return (
    <div className="pricing-grid">
      {plans.map((plan) => {
        const featured = plan.code === "basic";
        const price = Number(plan.monthly_price_ars);
        return (
          <article
            className={`price-card ${featured ? "featured" : ""}`}
            key={plan.code}
          >
            {featured && <span className="recommended">Más elegido</span>}
            <h3>{plan.display_name}</h3>
            <div className="price">
              <strong>
                {price === 0
                  ? "Gratis"
                  : `$ ${price.toLocaleString("es-AR")}`}
              </strong>
              {price > 0 && <span>/ mes</span>}
            </div>
            <p>{description(plan.code)}</p>
            <ul>
              <li>
                <Check size={16} />
                {plan.conversation_limit.toLocaleString("es-AR")} conversaciones
              </li>
              <li>
                <Check size={16} />
                {plan.notification_limit} notificaciones de eventos
              </li>
              <li>
                <Check size={16} />
                Check-ins sin consumir cupo
              </li>
              <li>
                <Check size={16} />
                Texto, audio e imágenes
              </li>
            </ul>
            <Link
              href={
                plan.code === "free"
                  ? "/registro"
                  : `/registro?plan=${plan.code}`
              }
              className={`button ${featured ? "button-gold" : "button-outline"}`}
            >
              {price === 0
                ? "Empezar gratis"
                : `Elegir ${plan.display_name}`}
              <ArrowRight size={17} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function description(code: string): string {
  if (code === "free") {
    return "Para conocer a tu compañero.";
  }
  if (code === "basic") {
    return "Para acompañarte todos los días.";
  }
  return "Para usarlo sin estar contando.";
}
