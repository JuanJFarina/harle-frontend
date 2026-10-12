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
  timezone: string;
  plan_code: string;
  subscription_period_starts_at: string;
  subscription_period_ends_at: string;
  telegram_link: TelegramLinkStatus;
  csrf_token: string;
  session_expires_at: string;
};

export type PublicPlan = {
  code: string;
  display_name: string;
  monthly_price_ars: string;
  currency: string;
  billing_interval: string;
  conversation_limit: number;
  notification_limit: number;
};

export type Subscription = {
  plan: PublicPlan;
  pending_plan: PublicPlan | null;
  status: string;
  period_starts_at: string;
  period_ends_at: string;
  provider_status: string | null;
  checkout_url: string | null;
  cancel_at_period_end: boolean;
  next_payment_at: string | null;
};

export type Checkout = {
  subscription_id: string;
  plan_code: string;
  status: string;
  checkout_url: string;
};

export type EventRecurrence =
  | { week_days: string[] }
  | { month_days: number[] };

export type CalendarEvent = {
  event_id: string;
  title: string;
  description: string;
  local_start: string;
  local_end: string;
  timezone: string;
  all_day: boolean;
  event_type: "user_event";
  status: "active" | "disabled";
  recurrence_rule: EventRecurrence | null;
  notification_window_start: string;
  notify_minutes_before: number;
  last_notified_at: string | null;
};

export type CalendarOccurrence = {
  event_id: string;
  local_start: string;
  local_end: string;
  timezone: string;
  all_day: boolean;
};

export type NotificationQuota = {
  period_limit: number;
  remaining: number;
  period_ends_at: string;
};

export type EventsView = {
  start_date: string;
  end_date: string;
  timezone: string;
  events: CalendarEvent[];
  occurrences: CalendarOccurrence[];
  notification_quota: NotificationQuota;
};

export type EventInput = {
  title: string;
  description: string;
  starts_at?: string;
  ends_at?: string;
  start_date?: string;
  end_date?: string;
  timezone?: string;
  notify_minutes_before: number;
  recurrence_rule: EventRecurrence | null;
};

export type EventMutation = {
  operation: string;
  event: CalendarEvent;
  notification_quota: NotificationQuota;
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

export async function getPlans(signal?: AbortSignal): Promise<PublicPlan[]> {
  return request<PublicPlan[]>("/api/plans", { signal });
}

export async function getSubscription(
  signal?: AbortSignal,
): Promise<Subscription> {
  return request<Subscription>("/api/subscription", { signal });
}

export async function createSubscriptionCheckout(
  planCode: string,
  csrfToken: string,
): Promise<Checkout> {
  return request<Checkout>("/api/subscription/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ plan_code: planCode }),
  });
}

export async function cancelSubscription(
  csrfToken: string,
): Promise<Subscription> {
  return request<Subscription>("/api/subscription/cancel", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
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

export async function getEvents(
  startDate: string,
  endDate: string,
  signal?: AbortSignal,
): Promise<EventsView> {
  const query = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    include_disabled: "true",
  });
  return request<EventsView>(`/api/events?${query}`, { signal });
}

export async function createEvent(
  event: EventInput,
  csrfToken: string,
): Promise<EventMutation> {
  return eventMutation("/api/events", csrfToken, event);
}

export async function updateEvent(
  eventId: string,
  event: EventInput,
  csrfToken: string,
): Promise<EventMutation> {
  return eventMutation(`/api/events/${eventId}`, csrfToken, event);
}

export async function setEventEnabled(
  eventId: string,
  enabled: boolean,
  csrfToken: string,
): Promise<EventMutation> {
  return eventMutation(
    `/api/events/${eventId}/${enabled ? "enable" : "disable"}`,
    csrfToken,
  );
}

export async function deleteEvent(
  eventId: string,
  csrfToken: string,
): Promise<EventMutation> {
  return eventMutation(`/api/events/${eventId}/delete`, csrfToken);
}

function eventMutation(
  path: string,
  csrfToken: string,
  body?: EventInput,
): Promise<EventMutation> {
  return request<EventMutation>(path, {
    method: "POST",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      "X-CSRF-Token": csrfToken,
    },
    body: body ? JSON.stringify(body) : undefined,
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
