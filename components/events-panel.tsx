"use client";

import {
  AlertCircle,
  BellRing,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  LoaderCircle,
  Plus,
  Repeat2,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDashboardSession } from "@/components/dashboard-session";
import {
  CalendarEvent,
  CalendarOccurrence,
  createEvent,
  deleteEvent,
  EventInput,
  EventsView,
  getEvents,
  HarleApiError,
  setEventEnabled,
  updateEvent,
} from "@/lib/harle-api";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const weekDayValues = [
  ["monday", "Lun"],
  ["tuesday", "Mar"],
  ["wednesday", "Mié"],
  ["thursday", "Jue"],
  ["friday", "Vie"],
  ["saturday", "Sáb"],
  ["sunday", "Dom"],
] as const;

type RecurrenceKind = "none" | "weekly" | "monthly";

export function EventsPanel() {
  const router = useRouter();
  const session = useDashboardSession();
  const [viewMonth, setViewMonth] = useState(() =>
    monthStart(parseIsoDate(todayIso(session.timezone))),
  );
  const [view, setView] = useState<EventsView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HarleApiError | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [allDay, setAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceKind>("none");
  const [busyEventId, setBusyEventId] = useState<string | null>(null);

  const range = useMemo(() => monthRange(viewMonth), [viewMonth]);
  const loadEvents = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const result = await getEvents(range.start, range.end, signal);
        setView(result);
        setError(null);
      } catch (caught) {
        if (signal?.aborted) {
          return;
        }
        if (caught instanceof HarleApiError && caught.status === 401) {
          router.replace("/ingresar");
          return;
        }
        setError(asApiError(caught));
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [range.end, range.start, router],
  );

  useEffect(() => {
    const controller = new AbortController();
    void getEvents(range.start, range.end, controller.signal)
      .then((result) => {
        setView(result);
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
        setError(asApiError(caught));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [range.end, range.start, router]);

  const eventsById = useMemo(
    () => new Map(view?.events.map((event) => [event.event_id, event]) ?? []),
    [view?.events],
  );
  const occurrencesByDate = useMemo(
    () => groupOccurrencesByDate(view?.occurrences ?? []),
    [view?.occurrences],
  );
  const calendarDays = useMemo(() => calendarGrid(viewMonth), [viewMonth]);
  const upcoming = useMemo(
    () => upcomingEntries(view, eventsById),
    [eventsById, view],
  );

  function openNew() {
    setEditing(null);
    setAllDay(false);
    setRecurrence("none");
    setEditorOpen(true);
  }

  function openEdit(event: CalendarEvent) {
    setEditing(event);
    setAllDay(event.all_day);
    setRecurrence(recurrenceKind(event));
    setEditorOpen(true);
  }

  async function saveEvent(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    const form = new FormData(submitEvent.currentTarget);
    setBusyEventId(editing?.event_id ?? "new");
    setError(null);
    try {
      const input = eventInput(form, allDay, recurrence, session.timezone);
      if (editing) {
        await updateEvent(editing.event_id, input, session.csrf_token);
      } else {
        await createEvent(input, session.csrf_token);
      }
      await loadEvents();
      setEditorOpen(false);
      setEditing(null);
    } catch (caught) {
      handleMutationError(caught, router.replace, setError);
    } finally {
      setBusyEventId(null);
    }
  }

  async function toggleEvent(event: CalendarEvent) {
    setBusyEventId(event.event_id);
    setError(null);
    try {
      await setEventEnabled(
        event.event_id,
        event.status !== "active",
        session.csrf_token,
      );
      await loadEvents();
    } catch (caught) {
      handleMutationError(caught, router.replace, setError);
    } finally {
      setBusyEventId(null);
    }
  }

  async function removeEvent(event: CalendarEvent) {
    if (
      !window.confirm(
        `¿Eliminar permanentemente “${event.title}” y todas sus repeticiones?`,
      )
    ) {
      return;
    }
    setBusyEventId(event.event_id);
    setError(null);
    try {
      await deleteEvent(event.event_id, session.csrf_token);
      await loadEvents();
    } catch (caught) {
      handleMutationError(caught, router.replace, setError);
    } finally {
      setBusyEventId(null);
    }
  }

  const activeCount =
    view?.events.filter((event) => event.status === "active").length ?? 0;
  const recurringCount =
    view?.events.filter((event) => event.recurrence_rule !== null).length ?? 0;

  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Eventos personales</span>
          <h1>Tu agenda, sin olvidos.</h1>
          <p>Organizá tus eventos y elegí cuándo querés que te avisemos.</p>
        </div>
        <button type="button" className="button button-gold" onClick={openNew}>
          <Plus size={17} />
          Nuevo evento
        </button>
      </div>

      {error && (
        <div className="inline-api-error events-api-error" role="alert">
          <AlertCircle size={17} />
          <span>
            {error.message}
            {error.requestId && <small>Referencia: {error.requestId}</small>}
          </span>
          <button type="button" onClick={() => void loadEvents()}>
            Reintentar
          </button>
        </div>
      )}

      <div className="events-summary">
        <Summary icon={<CalendarDays size={20} />} value={activeCount} label="eventos activos" />
        <Summary icon={<Repeat2 size={20} />} value={recurringCount} label="eventos recurrentes" />
        <Summary
          icon={<BellRing size={20} />}
          value={view?.notification_quota.remaining ?? "—"}
          label="notificaciones disponibles"
        />
      </div>

      {loading ? (
        <div className="dashboard-session-state" aria-live="polite">
          <LoaderCircle className="spin" size={28} />
          <strong>Cargando tu agenda…</strong>
        </div>
      ) : (
        <div className="events-layout">
          <section className="panel-card big-calendar-card">
            <div className="calendar-toolbar">
              <div>
                <h2>{monthName(viewMonth)}</h2>
                <p>Los horarios se muestran en {view?.timezone ?? session.timezone}</p>
              </div>
              <div>
                <button
                  type="button"
                  aria-label="Mes anterior"
                  onClick={() => {
                    setLoading(true);
                    setViewMonth(addMonths(viewMonth, -1));
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="today-button"
                  onClick={() => {
                    setLoading(true);
                    setViewMonth(
                      monthStart(parseIsoDate(todayIso(session.timezone))),
                    );
                  }}
                >
                  Hoy
                </button>
                <button
                  type="button"
                  aria-label="Mes siguiente"
                  onClick={() => {
                    setLoading(true);
                    setViewMonth(addMonths(viewMonth, 1));
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="big-calendar">
              {weekDays.map((day) => (
                <span className="calendar-weekday" key={day}>
                  {day}
                </span>
              ))}
              {calendarDays.map((day) => {
                const occurrences = occurrencesByDate.get(day.iso) ?? [];
                return (
                  <button
                    type="button"
                    className={[
                      "calendar-cell",
                      day.inMonth ? "" : "outside",
                      day.iso === todayIso(session.timezone) ? "selected" : "",
                      occurrences.length ? "with-event" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={day.iso}
                  >
                    <span>{day.day}</span>
                    {occurrences.slice(0, 2).map((occurrence) => (
                      <small key={`${occurrence.event_id}-${occurrence.local_start}`}>
                        {eventsById.get(occurrence.event_id)?.title ?? "Evento"}
                      </small>
                    ))}
                    {occurrences.length > 2 && <small>+{occurrences.length - 2}</small>}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="panel-card upcoming-card">
            <div className="panel-card-title-row">
              <div>
                <h2>Próximos eventos</h2>
                <p>{monthName(viewMonth)}</p>
              </div>
            </div>
            <div className="upcoming-list">
              {upcoming.length === 0 && (
                <div className="events-empty">
                  <CalendarDays size={24} />
                  <p>No tenés eventos en este mes.</p>
                </div>
              )}
              {upcoming.map(({ event, occurrence, key }) => (
                <article
                  className={`upcoming-event ${event.status === "active" ? "" : "disabled"}`}
                  key={key}
                >
                  <div className="upcoming-date">
                    <strong>{dateDay(occurrence.local_start)}</strong>
                    <span>{dateMonth(occurrence.local_start)}</span>
                  </div>
                  <div className="upcoming-copy">
                    <strong>{event.title}</strong>
                    <span>
                      <Clock3 size={13} />
                      {occurrence.all_day
                        ? "Todo el día"
                        : timeLabel(occurrence.local_start)}
                    </span>
                    <small>
                      <Repeat2 size={12} />
                      {recurrenceLabel(event)}
                    </small>
                  </div>
                  <div className="upcoming-actions">
                    <button
                      type="button"
                      onClick={() => openEdit(event)}
                      disabled={busyEventId === event.event_id}
                      aria-label={`Editar ${event.title}`}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleEvent(event)}
                      disabled={busyEventId === event.event_id}
                      className={`mini-switch ${event.status === "active" ? "on" : ""}`}
                      role="switch"
                      aria-checked={event.status === "active"}
                      aria-label={`${event.status === "active" ? "Desactivar" : "Activar"} ${event.title}`}
                    >
                      <span />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeEvent(event)}
                      disabled={busyEventId === event.event_id}
                      aria-label={`Eliminar ${event.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {view && (
              <p className="notification-quota-note">
                Sólo las notificaciones entregadas consumen el cupo, incluso si
                después eliminás el evento.
              </p>
            )}
          </aside>
        </div>
      )}

      {editorOpen && (
        <EventEditor
          key={editing?.event_id ?? "new"}
          editing={editing}
          allDay={allDay}
          recurrence={recurrence}
          timezone={session.timezone}
          busy={busyEventId !== null}
          onAllDayChange={setAllDay}
          onRecurrenceChange={setRecurrence}
          onClose={() => setEditorOpen(false)}
          onSubmit={saveEvent}
        />
      )}
    </>
  );
}

function EventEditor({
  editing,
  allDay,
  recurrence,
  timezone,
  busy,
  onAllDayChange,
  onRecurrenceChange,
  onClose,
  onSubmit,
}: {
  editing: CalendarEvent | null;
  allDay: boolean;
  recurrence: RecurrenceKind;
  timezone: string;
  busy: boolean;
  onAllDayChange: (value: boolean) => void;
  onRecurrenceChange: (value: RecurrenceKind) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const startDate =
    editing?.local_start.slice(0, 10) ?? todayIso(timezone);
  const endDate = editing?.local_end.slice(0, 10) ?? startDate;
  const weeklyDays =
    editing?.recurrence_rule && "week_days" in editing.recurrence_rule
      ? editing.recurrence_rule.week_days
      : [];
  const monthlyDays =
    editing?.recurrence_rule && "month_days" in editing.recurrence_rule
      ? editing.recurrence_rule.month_days.join(", ")
      : String(Number(startDate.slice(8, 10)));

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-card event-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="panel-kicker">
              {editing ? "Editar evento" : "Nuevo evento"}
            </span>
            <h2>{editing ? editing.title : "Sumalo a tu agenda"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <label>
            Título
            <input
              type="text"
              name="title"
              defaultValue={editing?.title}
              placeholder="Ej. Pagar alquiler"
              maxLength={200}
              required
            />
          </label>
          <label>
            Descripción
            <textarea
              name="description"
              defaultValue={editing?.description}
              rows={3}
              maxLength={2000}
              placeholder="Agregá un poco de contexto"
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(event) => onAllDayChange(event.target.checked)}
            />
            Evento de todo el día
          </label>
          <div className="form-grid">
            <label>
              Fecha de inicio
              <input type="date" name="start_date" defaultValue={startDate} required />
            </label>
            {!allDay && (
              <label>
                Hora de inicio
                <input
                  type="time"
                  name="start_time"
                  defaultValue={editing?.local_start.slice(11, 16) || "09:00"}
                  required
                />
              </label>
            )}
            <label>
              Fecha de fin
              <input type="date" name="end_date" defaultValue={endDate} required />
            </label>
            {!allDay && (
              <label>
                Hora de fin
                <input
                  type="time"
                  name="end_time"
                  defaultValue={editing?.local_end.slice(11, 16) || "10:00"}
                  required
                />
              </label>
            )}
          </div>
          <small className="form-help">Zona horaria: {timezone}</small>
          <div className="form-grid">
            <label>
              Repetición
              <select
                name="recurrence"
                value={recurrence}
                onChange={(event) =>
                  onRecurrenceChange(event.target.value as RecurrenceKind)
                }
              >
                <option value="none">No se repite</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </label>
            <label>
              Avisarme
              <select
                name="reminder"
                defaultValue={String(editing?.notify_minutes_before ?? 60)}
              >
                <option value="0">Al comenzar</option>
                <option value="15">15 minutos antes</option>
                <option value="60">1 hora antes</option>
                <option value="1440">1 día antes</option>
              </select>
            </label>
          </div>
          {recurrence === "weekly" && (
            <fieldset className="recurrence-fieldset">
              <legend>Días de la semana</legend>
              <div className="weekday-options">
                {weekDayValues.map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="checkbox"
                      name="week_days"
                      value={value}
                      defaultChecked={weeklyDays.includes(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {recurrence === "monthly" && (
            <label>
              Días del mes
              <input
                type="text"
                name="month_days"
                defaultValue={monthlyDays}
                placeholder="Ej. 1, 15, 31"
                required
              />
              <small className="form-help">
                Si un mes no tiene uno de esos días, esa repetición se omite.
              </small>
            </label>
          )}
          <div className="modal-actions">
            <button type="button" className="button button-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button button-gold" disabled={busy}>
              {busy && <LoaderCircle className="spin" size={17} />}
              {editing ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Summary({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <article>
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </article>
  );
}

function eventInput(
  form: FormData,
  allDay: boolean,
  recurrence: RecurrenceKind,
  timezone: string,
): EventInput {
  const startDate = String(form.get("start_date"));
  const endDate = String(form.get("end_date"));
  const input: EventInput = {
    title: String(form.get("title")),
    description: String(form.get("description")),
    timezone,
    notify_minutes_before: Number(form.get("reminder")),
    recurrence_rule: null,
  };
  if (allDay) {
    input.start_date = startDate;
    input.end_date = endDate;
  } else {
    input.starts_at = `${startDate}T${String(form.get("start_time"))}`;
    input.ends_at = `${endDate}T${String(form.get("end_time"))}`;
  }
  if (recurrence === "weekly") {
    const days = form.getAll("week_days").map(String);
    if (!days.length) {
      throw new HarleApiError(
        "Elegí al menos un día de la semana.",
        422,
        "validation_error",
      );
    }
    input.recurrence_rule = { week_days: days };
  }
  if (recurrence === "monthly") {
    const days = String(form.get("month_days"))
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 31);
    if (!days.length) {
      throw new HarleApiError(
        "Ingresá al menos un día del mes entre 1 y 31.",
        422,
        "validation_error",
      );
    }
    input.recurrence_rule = { month_days: [...new Set(days)] };
  }
  return input;
}

function groupOccurrencesByDate(
  occurrences: CalendarOccurrence[],
): Map<string, CalendarOccurrence[]> {
  const grouped = new Map<string, CalendarOccurrence[]>();
  for (const occurrence of occurrences) {
    for (const date of occurrenceDates(occurrence)) {
      grouped.set(date, [...(grouped.get(date) ?? []), occurrence]);
    }
  }
  return grouped;
}

function occurrenceDates(occurrence: CalendarOccurrence): string[] {
  const start = occurrence.local_start.slice(0, 10);
  const end = occurrence.local_end.slice(0, 10);
  const dates: string[] = [];
  for (
    let cursor = parseIsoDate(start);
    cursor <= parseIsoDate(end);
    cursor = addDays(cursor, 1)
  ) {
    dates.push(dateIso(cursor));
  }
  return dates;
}

function upcomingEntries(
  view: EventsView | null,
  eventsById: Map<string, CalendarEvent>,
) {
  if (!view) {
    return [];
  }
  const active = view.occurrences.flatMap((occurrence) => {
    const event = eventsById.get(occurrence.event_id);
    return event
      ? [{ event, occurrence, key: `${event.event_id}-${occurrence.local_start}` }]
      : [];
  });
  const disabled = view.events
    .filter((event) => event.status === "disabled")
    .map((event) => ({
      event,
      occurrence: {
        event_id: event.event_id,
        local_start: event.local_start,
        local_end: event.local_end,
        timezone: event.timezone,
        all_day: event.all_day,
      },
      key: `${event.event_id}-disabled`,
    }));
  return [...active, ...disabled].sort((left, right) =>
    left.occurrence.local_start.localeCompare(right.occurrence.local_start),
  );
}

function recurrenceKind(event: CalendarEvent): RecurrenceKind {
  if (!event.recurrence_rule) {
    return "none";
  }
  return "week_days" in event.recurrence_rule ? "weekly" : "monthly";
}

function recurrenceLabel(event: CalendarEvent): string {
  const kind = recurrenceKind(event);
  if (kind === "weekly") {
    return "Semanal";
  }
  if (kind === "monthly") {
    return "Mensual";
  }
  return "No se repite";
}

function calendarGrid(month: Date) {
  const first = monthStart(month);
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const gridStart = addDays(first, -mondayOffset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      iso: dateIso(date),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === first.getUTCMonth(),
    };
  });
}

function monthRange(month: Date) {
  const start = monthStart(month);
  return {
    start: dateIso(start),
    end: dateIso(addDays(addMonths(start, 1), -1)),
  };
}

function monthStart(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
}

function addMonths(value: Date, amount: number): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + amount, 1));
}

function addDays(value: Date, amount: number): Date {
  const result = new Date(value);
  result.setUTCDate(result.getUTCDate() + amount);
  return result;
}

function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateIso(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function todayIso(timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  }).formatToParts(new Date());
  const value = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function monthName(value: Date): string {
  const label = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
  return label[0].toUpperCase() + label.slice(1);
}

function dateDay(value: string): string {
  return value.slice(8, 10);
}

function dateMonth(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    month: "short",
    timeZone: "UTC",
  })
    .format(parseIsoDate(value.slice(0, 10)))
    .replace(".", "")
    .toUpperCase();
}

function timeLabel(value: string): string {
  return value.slice(11, 16);
}

function handleMutationError(
  caught: unknown,
  redirect: (href: string) => void,
  setError: (error: HarleApiError) => void,
) {
  if (caught instanceof HarleApiError && caught.status === 401) {
    redirect("/ingresar");
    return;
  }
  setError(asApiError(caught));
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
