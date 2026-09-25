"use client";

import {
  ArrowUpRight,
  BellRing,
  Bot,
  Check,
  CreditCard,
  MessageCircle,
  Save,
  Send,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  firstName,
  initials,
  useDashboardSession,
} from "@/components/dashboard-session";
import { getPlan } from "@/lib/demo-data";

export function AccountPanel() {
  const session = useDashboardSession();
  const plan = getPlan(session.plan_code);
  const telegramConnected = session.telegram_link.state === "connected";
  const [frequency, setFrequency] = useState("Media");
  const [proactive, setProactive] = useState(true);
  const [saved, setSaved] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Mi cuenta</span>
          <h1>
            {greeting()}, {firstName(session.display_name)}.
          </h1>
          <p>Acá tenés un resumen de tu cuenta y tu compañero.</p>
        </div>
        <Link href="/#planes" className="button button-outline">
          Ver planes
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="usage-grid">
        <article className="usage-card">
          <span className="usage-icon">
            <MessageCircle size={20} />
          </span>
          <div>
            <small>Conversaciones incluidas</small>
            <strong>{plan.conversations.toLocaleString("es-AR")}</strong>
            <span>por período mensual</span>
          </div>
          <b>El consumo estará disponible próximamente</b>
        </article>
        <article className="usage-card">
          <span className="usage-icon">
            <BellRing size={20} />
          </span>
          <div>
            <small>Notificaciones incluidas</small>
            <strong>{plan.notifications.toLocaleString("es-AR")}</strong>
            <span>por período mensual</span>
          </div>
          <b>El consumo estará disponible próximamente</b>
        </article>
        <article className="usage-card plan-summary-card">
          <span className="usage-icon">
            <CreditCard size={20} />
          </span>
          <div>
            <small>Plan actual</small>
            <strong>{plan.name}</strong>
            <span>{planPrice(plan.price)}</span>
          </div>
          <div className="renewal-row">
            <span>Próxima renovación</span>
            <b>{formatDate(session.subscription_period_ends_at)}</b>
          </div>
        </article>
      </div>

      <div className="panel-columns">
        <div className="panel-column">
          <form className="panel-card settings-card" onSubmit={save}>
            <div className="panel-card-header">
              <span className="panel-card-icon">
                <UserRound size={20} />
              </span>
              <div>
                <h2>Tu perfil</h2>
                <p>Los datos que usa tu compañero para ubicarte.</p>
              </div>
            </div>
            <div className="form-grid">
              <label>
                Nombre preferido
                <input type="text" defaultValue={session.display_name} />
              </label>
              <label>
                Idioma
                <select defaultValue="es-AR">
                  <option value="es-AR">Español (Argentina)</option>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </label>
              <label>
                Zona horaria
                <select defaultValue="America/Argentina/Buenos_Aires">
                  <option value="America/Argentina/Buenos_Aires">
                    Buenos Aires (UTC−3)
                  </option>
                  <option value="America/Argentina/Cordoba">
                    Córdoba (UTC−3)
                  </option>
                </select>
              </label>
              <label>
                Ubicación
                <input type="text" defaultValue="Buenos Aires, Argentina" />
              </label>
            </div>
            <div className="form-actions">
              <span className={saved ? "save-status visible" : "save-status"}>
                <Check size={15} />
                Guardado
              </span>
              <button className="button button-gold" type="submit">
                <Save size={16} />
                Guardar cambios
              </button>
            </div>
          </form>

          <section className="panel-card assistant-card">
            <div className="panel-card-header">
              <span className="panel-card-icon">
                <Bot size={20} />
              </span>
              <div>
                <h2>Tu compañero</h2>
                <p>Definí cómo querés que se comporte con vos.</p>
              </div>
            </div>
            <label>
              Nombre visible
              <input type="text" defaultValue="Compañero" />
            </label>
            <label>
              Cómo querés que sea
              <textarea
                rows={4}
                defaultValue="Directo, cálido y práctico. Prefiero respuestas cortas, salvo que el tema necesite más detalle."
              />
            </label>
            <div className="proactive-setting">
              <div>
                <strong>Check-ins proactivos</strong>
                <span>Puede volver a escribirte para hacer seguimiento.</span>
              </div>
              <button
                type="button"
                className={`switch ${proactive ? "on" : ""}`}
                onClick={() => setProactive((value) => !value)}
                role="switch"
                aria-checked={proactive}
              >
                <span />
              </button>
            </div>
            {proactive && (
              <div className="frequency-setting">
                <span>Frecuencia</span>
                <div className="segmented-control">
                  {["Baja", "Media", "Alta"].map((option) => (
                    <button
                      type="button"
                      className={frequency === option ? "active" : ""}
                      onClick={() => setFrequency(option)}
                      key={option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="panel-column side-column">
          <section className="panel-card telegram-card">
            <div className="telegram-card-mark">
              <Send size={27} fill="currentColor" />
            </div>
            <span
              className={`connection-status ${telegramConnected ? "" : "pending"}`}
            >
              <i />
              {telegramConnected ? "Conectado" : "Sin conectar"}
            </span>
            <h2>Telegram</h2>
            <p>
              {telegramConnected
                ? "Tu cuenta está conectada. Ya podés hablar con tu compañero desde el bot."
                : "Todavía falta conectar una cuenta de Telegram."}
            </p>
            <div className="connected-account">
              <span>{initials(session.display_name)}</span>
              <div>
                <strong>{session.display_name}</strong>
                <small>
                  {telegramConnected ? "Vínculo activo" : "Vínculo pendiente"}
                </small>
              </div>
            </div>
            <Link href="/registro" className="button button-outline">
              {telegramConnected ? "Revisar conexión" : "Conectar Telegram"}
              <ArrowUpRight size={17} />
            </Link>
          </section>

          <section className="panel-card subscription-card">
            <div className="panel-card-header">
              <span className="panel-card-icon">
                <CreditCard size={20} />
              </span>
              <div>
                <h2>Suscripción</h2>
                <p>
                  Activa desde{" "}
                  {formatDate(session.subscription_period_starts_at)}.
                </p>
              </div>
            </div>
            <dl>
              <div>
                <dt>Plan</dt>
                <dd>{plan.name}</dd>
              </div>
              <div>
                <dt>Importe</dt>
                <dd>{planPrice(plan.price)}</dd>
              </div>
              <div>
                <dt>Período actual</dt>
                <dd>
                  {formatShortDate(session.subscription_period_starts_at)} —{" "}
                  {formatShortDate(session.subscription_period_ends_at)}
                </dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd className="active-text">Activa</dd>
              </div>
            </dl>
            <span className="text-action">Planes pagos próximamente</span>
          </section>
        </div>
      </div>
    </>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Buen día";
  }
  if (hour < 20) {
    return "Buenas tardes";
  }
  return "Buenas noches";
}

function planPrice(price: number): string {
  if (price === 0) {
    return "Sin costo";
  }
  return `ARS ${price.toLocaleString("es-AR")} / mes`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}
