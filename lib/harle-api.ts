export type TelegramLinkState = "disconnected" | "pending" | "connected";

export type TelegramLinkStatus = {
  state: TelegramLinkState;
  expires_at: string | null;
};

export type TelegramLink = TelegramLinkStatus & {
  url: string | null;
};

export type WebSession = {
  user_id: string;
  display_name: string;
  plan_code: string;
  subscription_period_starts_at: string;
  subscription_period_ends_at: string;
  telegram_link: TelegramLinkStatus;
  csrf_token: string;
  session_expires_at: string;
};

type ErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    request_id?: string;
  };
};

export class HarleApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "HarleApiError";
  }
}

export function startGoogleAuthentication(): void {
  const url = new URL(apiPath("/api/auth/google/start"), window.location.origin);
  url.searchParams.set("locale", navigator.language || "es-AR");
  url.searchParams.set(
    "timezone",
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  window.location.assign(url);
}

export async function getSession(signal?: AbortSignal): Promise<WebSession> {
  return request<WebSession>("/api/session", { signal });
}

export async function getTelegramLink(
  signal?: AbortSignal,
): Promise<TelegramLink> {
  return request<TelegramLink>("/api/account/telegram-link", { signal });
}

export async function createTelegramLink(
  csrfToken: string,
): Promise<TelegramLink> {
  return request<TelegramLink>("/api/account/telegram-link", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
}

export async function logout(csrfToken: string): Promise<void> {
  await request<{ ok: boolean }>("/api/auth/logout", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
}

async function request<Response>(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  let response: globalThis.Response;
  try {
    response = await fetch(apiPath(path), {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new HarleApiError(
      "No pudimos comunicarnos con el servidor.",
      0,
      "network_error",
    );
  }

  const payload = (await response.json().catch(() => ({}))) as
    | Response
    | ErrorEnvelope;
  if (!response.ok) {
    const error = (payload as ErrorEnvelope).error;
    throw new HarleApiError(
      error?.message ?? "No pudimos completar la solicitud.",
      response.status,
      error?.code ?? "request_failed",
      error?.request_id ?? response.headers.get("X-Request-ID") ?? undefined,
    );
  }
  return payload as Response;
}

function apiPath(path: string): string {
  if (!path.startsWith("/api/")) {
    throw new HarleApiError(
      "La ruta del backend no es válida.",
      0,
      "configuration_error",
    );
  }
  return path;
}
