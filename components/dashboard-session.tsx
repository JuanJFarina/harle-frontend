"use client";

import { AlertCircle, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getPlan } from "@/lib/demo-data";
import { getSession, HarleApiError, WebSession } from "@/lib/harle-api";

const DashboardSessionContext = createContext<WebSession | null>(null);

export function DashboardSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<WebSession | null>(null);
  const [error, setError] = useState<HarleApiError | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void getSession(controller.signal)
      .then((currentSession) => {
        setSession(currentSession);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (caught instanceof HarleApiError && caught.status === 401) {
          router.replace("/ingresar");
          return;
        }
        setError(
          caught instanceof HarleApiError
            ? caught
            : new HarleApiError(
                "No pudimos cargar tu cuenta.",
                0,
                "unexpected_error",
              ),
        );
      });
    return () => controller.abort();
  }, [router]);

  if (error) {
    return (
      <main className="dashboard-session-state" role="alert">
        <AlertCircle size={28} />
        <strong>No pudimos cargar tu cuenta</strong>
        <span>{error.message}</span>
        {error.requestId && <small>Referencia: {error.requestId}</small>}
        <button type="button" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="dashboard-session-state" aria-live="polite">
        <LoaderCircle className="spin" size={28} />
        <strong>Cargando tu cuenta…</strong>
      </main>
    );
  }

  return (
    <DashboardSessionContext.Provider value={session}>
      {children}
    </DashboardSessionContext.Provider>
  );
}

export function DashboardPlanSummary() {
  const session = useDashboardSession();
  const plan = getPlan(session.plan_code);

  return (
    <div className="sidebar-plan">
      <span>
        <Sparkles size={15} />
        Plan {plan.name}
      </span>
      <strong>{plan.conversations.toLocaleString("es-AR")}</strong>
      <small>conversaciones incluidas por período</small>
    </div>
  );
}

export function DashboardUserSummary() {
  const session = useDashboardSession();
  const plan = getPlan(session.plan_code);

  return (
    <>
      <span className="profile-avatar">{initials(session.display_name)}</span>
      <span className="profile-name">
        <strong>{firstName(session.display_name)}</strong>
        <small>Plan {plan.name}</small>
      </span>
    </>
  );
}

export function useDashboardSession(): WebSession {
  const session = useContext(DashboardSessionContext);
  if (!session) {
    throw new Error("Dashboard session is unavailable.");
  }
  return session;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}
