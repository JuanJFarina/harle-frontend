"use client";

import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Send,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  createTelegramLink,
  getSession,
  getTelegramLink,
  HarleApiError,
  logout,
  startGoogleAuthentication,
  TelegramLink,
  WebSession,
} from "@/lib/harle-api";
import { getPlan } from "@/lib/demo-data";

type RegistrationFlowProps = {
  mode: "register" | "login";
  requestedPlan?: string;
};

type ScreenState = "loading" | "anonymous" | "authenticated" | "error";

export function RegistrationFlow({
  mode,
  requestedPlan = "free",
}: RegistrationFlowProps) {
  const [screen, setScreen] = useState<ScreenState>("loading");
  const [session, setSession] = useState<WebSession | null>(null);
  const [telegramLink, setTelegramLink] = useState<TelegramLink | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<HarleApiError | null>(null);

  const loadSession = useCallback(async (signal?: AbortSignal) => {
    try {
      const currentSession = await getSession(signal);
      setSession(currentSession);
      setTelegramLink({
        ...currentSession.telegram_link,
        url: null,
      });
      setScreen("authenticated");
      setError(null);
    } catch (caught) {
      if (signal?.aborted) {
        return;
      }
      if (caught instanceof HarleApiError && caught.status === 401) {
        setScreen("anonymous");
        setSession(null);
        setTelegramLink(null);
        setError(null);
        return;
      }
      setError(asApiError(caught));
      setScreen("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void getSession(controller.signal)
      .then((currentSession) => {
        setSession(currentSession);
        setTelegramLink({
          ...currentSession.telegram_link,
          url: null,
        });
        setScreen("authenticated");
        setError(null);
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (caught instanceof HarleApiError && caught.status === 401) {
          setScreen("anonymous");
          setSession(null);
          setTelegramLink(null);
          setError(null);
          return;
        }
        setError(asApiError(caught));
        setScreen("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (telegramLink?.state !== "pending") {
      return;
    }
    const controller = new AbortController();
    const timer = window.setInterval(async () => {
      try {
        const currentLink = await getTelegramLink(controller.signal);
        setTelegramLink((previous) => ({
          ...currentLink,
          url:
            currentLink.state === "pending" ? (previous?.url ?? null) : null,
        }));
      } catch (caught) {
        if (controller.signal.aborted) {
          return;
        }
        if (caught instanceof HarleApiError && caught.status === 401) {
          setSession(null);
          setTelegramLink(null);
          setScreen("anonymous");
          setError(null);
          return;
        }
        setError(asApiError(caught));
      }
    }, 2500);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [telegramLink?.state]);

  function beginGoogleFlow() {
    setError(null);
    try {
      startGoogleAuthentication();
    } catch (caught) {
      setError(asApiError(caught));
    }
  }

  async function issueTelegramLink() {
    if (!session) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setTelegramLink(await createTelegramLink(session.csrf_token));
    } catch (caught) {
      if (caught instanceof HarleApiError && caught.status === 401) {
        setSession(null);
        setTelegramLink(null);
        setScreen("anonymous");
        setError(null);
      } else {
        setError(asApiError(caught));
      }
    } finally {
      setBusy(false);
    }
  }

  async function endSession() {
    if (!session) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await logout(session.csrf_token);
      setSession(null);
      setTelegramLink(null);
      setScreen("anonymous");
    } catch (caught) {
      if (caught instanceof HarleApiError && caught.status === 401) {
        setSession(null);
        setTelegramLink(null);
        setScreen("anonymous");
        setError(null);
      } else {
        setError(asApiError(caught));
      }
    } finally {
      setBusy(false);
    }
  }

  if (screen === "loading") {
    return (
      <div className="registration-loading" aria-live="polite">
        <LoaderCircle className="spin" size={28} />
        <strong>Revisando tu sesión…</strong>
        <span>Esto demora sólo un momento.</span>
      </div>
    );
  }

  if (screen === "error" && !session) {
    return (
      <div className="registration-error" role="alert">
        <AlertCircle size={28} />
        <h2>No pudimos abrir el registro</h2>
        <p>{error?.message}</p>
        {error?.requestId && <small>Referencia: {error.requestId}</small>}
        <button
          type="button"
          className="button button-outline"
          onClick={() => {
            setScreen("loading");
            void loadSession();
          }}
        >
          <RefreshCw size={17} />
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (screen === "anonymous") {
    const paidPlanRequested = requestedPlan !== "free";
    return (
      <div className="google-entry">
        {paidPlanRequested && (
          <div className="registration-notice">
            <AlertCircle size={17} />
            <span>
              Los planes pagos todavía no están habilitados. Podés empezar con
              el plan Gratuito y cambiarlo más adelante.
            </span>
          </div>
        )}
        <div className="selected-plan">
          <span>
            Plan inicial <strong>Gratuito</strong>
          </span>
          <span>60 conversaciones / mes</span>
        </div>
        <button
          type="button"
          className="google-button google-button-primary"
          onClick={beginGoogleFlow}
        >
          <span className="google-mark">G</span>
          {mode === "register" ? "Continuar con Google" : "Ingresar con Google"}
          <ArrowRight size={18} />
        </button>
        <div className="registration-benefits">
          <span>
            <Check size={15} />
            Sin tarjeta
          </span>
          <span>
            <Check size={15} />
            Sesión segura
          </span>
          <span>
            <Check size={15} />
            15 notificaciones mensuales
          </span>
        </div>
        <p className="registration-terms">
          Al continuar, aceptás los <a href="#">términos</a> y la{" "}
          <a href="#">política de privacidad</a>.
        </p>
        {error && <InlineError error={error} />}
      </div>
    );
  }

  if (!session || !telegramLink) {
    return null;
  }

  const connected = telegramLink.state === "connected";
  const currentPlan = getPlan(session.plan_code);
  return (
    <div className="registration-account">
      <ol className="registration-steps" aria-label="Progreso del registro">
        <li className="complete">
          <span>
            <Check size={14} />
          </span>
          Cuenta
        </li>
        <li className={connected ? "complete" : "active"}>
          <span>{connected ? <Check size={14} /> : "2"}</span>
          Telegram
        </li>
        <li className={connected ? "active" : ""}>
          <span>3</span>
          Listo
        </li>
      </ol>

      <div className="registered-account-card">
        <span className="registered-avatar">
          {initials(session.display_name)}
        </span>
        <div>
          <small>Cuenta {currentPlan.name} activa</small>
          <strong>{session.display_name}</strong>
          <span>
            El período se renueva el{" "}
            {formatDate(session.subscription_period_ends_at)}
          </span>
        </div>
        <ShieldCheck size={20} />
      </div>

      {connected ? (
        <div className="telegram-connected">
          <span>
            <CheckCircle2 size={30} />
          </span>
          <h2>Tu Telegram ya está conectado</h2>
          <p>
            Ya podés conversar con tu compañero y usar las funciones de tu plan
            {" "}
            {currentPlan.name}.
          </p>
          <Link href="/panel" className="button button-gold button-large">
            Continuar al panel
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="telegram-connection">
          <span className="telegram-connection-icon">
            <Send size={26} fill="currentColor" />
          </span>
          <h2>Conectá tu Telegram</h2>
          <p>
            Generá un enlace privado, abrilo con la cuenta que querés vincular
            y presioná <strong>Iniciar</strong> en el bot.
          </p>

          {telegramLink.state === "pending" && (
            <div className="pending-link">
              <LoaderCircle className="spin" size={17} />
              <span>
                Esperando la confirmación de Telegram
                {telegramLink.expires_at && (
                  <small>
                    El enlace vence a las {formatTime(telegramLink.expires_at)}
                  </small>
                )}
              </span>
            </div>
          )}

          {telegramLink.url ? (
            <a
              href={telegramLink.url}
              target="_blank"
              rel="noreferrer"
              className="button telegram-open-button button-large"
            >
              <Send size={18} />
              Abrir Telegram
            </a>
          ) : (
            <button
              type="button"
              className="button telegram-open-button button-large"
              onClick={() => void issueTelegramLink()}
              disabled={busy}
            >
              {busy ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              {telegramLink.state === "pending"
                ? "Generar un enlace nuevo"
                : "Conectar Telegram"}
            </button>
          )}
        </div>
      )}

      {error && <InlineError error={error} />}
      <button
        type="button"
        className="registration-logout"
        onClick={() => void endSession()}
        disabled={busy}
      >
        <LogOut size={15} />
        Usar otra cuenta
      </button>
    </div>
  );
}

function InlineError({ error }: { error: HarleApiError }) {
  return (
    <div className="inline-api-error" role="alert">
      <AlertCircle size={16} />
      <span>
        {error.message}
        {error.requestId && <small>Referencia: {error.requestId}</small>}
      </span>
    </div>
  );
}

function asApiError(error: unknown): HarleApiError {
  if (error instanceof HarleApiError) {
    return error;
  }
  return new HarleApiError(
    "Ocurrió un error inesperado.",
    0,
    "unexpected_error",
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
