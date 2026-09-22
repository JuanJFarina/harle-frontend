"use client";

import {
  BellRing,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Plus,
  Repeat2,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { initialEvents, PersonalEvent } from "@/lib/demo-data";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function EventsPanel() {
  const [events, setEvents] = useState(initialEvents);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<PersonalEvent | null>(null);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }

  function openEdit(event: PersonalEvent) {
    setEditing(event);
    setEditorOpen(true);
  }

  function saveEvent(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    const form = new FormData(submitEvent.currentTarget);
    const date = new Date(`${String(form.get("date"))}T12:00:00`);
    const event: PersonalEvent = {
      id: editing?.id ?? `event-${Date.now()}`,
      title: String(form.get("title")),
      description: String(form.get("description")),
      date: new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
      })
        .format(date)
        .replace(".", ""),
      time: String(form.get("time")),
      recurrence: String(form.get("recurrence")),
      active: editing?.active ?? true,
    };

    setEvents((current) =>
      editing
        ? current.map((item) => (item.id === editing.id ? event : item))
        : [...current, event],
    );
    setEditorOpen(false);
    setEditing(null);
  }

  function toggleEvent(id: string) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id ? { ...event, active: !event.active } : event,
      ),
    );
  }

  function removeEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
  }

  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Eventos personales</span>
          <h1>Tu agenda, sin olvidos.</h1>
          <p>Organizá tus eventos y elegí cuándo querés que te avisemos.</p>
        </div>
        <button
          type="button"
          className="button button-gold"
          onClick={openNew}
        >
          <Plus size={17} />
          Nuevo evento
        </button>
      </div>

      <div className="events-summary">
        <article>
          <span>
            <CalendarDays size={20} />
          </span>
          <div>
            <strong>{events.filter((event) => event.active).length}</strong>
            <small>eventos activos</small>
          </div>
        </article>
        <article>
          <span>
            <Repeat2 size={20} />
          </span>
          <div>
            <strong>
              {
                events.filter(
                  (event) => event.recurrence !== "No se repite",
                ).length
              }
            </strong>
            <small>eventos recurrentes</small>
          </div>
        </article>
        <article>
          <span>
            <BellRing size={20} />
          </span>
          <div>
            <strong>42</strong>
            <small>notificaciones disponibles</small>
          </div>
        </article>
      </div>

      <div className="events-layout">
        <section className="panel-card big-calendar-card">
          <div className="calendar-toolbar">
            <div>
              <h2>Octubre 2026</h2>
              <p>Tus próximos eventos</p>
            </div>
            <div>
              <button type="button" aria-label="Mes anterior">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="today-button">
                Hoy
              </button>
              <button type="button" aria-label="Mes siguiente">
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
            {Array.from({ length: 35 }, (_, index) => {
              const day = index - 2;
              const labels: Record<number, string> = {
                1: "Alquiler",
                3: "Dentista",
                6: "Gastos",
                20: "Internet",
              };
              return (
                <button
                  type="button"
                  className={[
                    "calendar-cell",
                    day < 1 || day > 31 ? "outside" : "",
                    day === 3 ? "selected" : "",
                    labels[day] ? "with-event" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={index}
                >
                  {day > 0 && day <= 31 && (
                    <>
                      <span>{day}</span>
                      {labels[day] && <small>{labels[day]}</small>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <aside className="panel-card upcoming-card">
          <div className="panel-card-title-row">
            <div>
              <h2>Próximos eventos</h2>
              <p>Octubre 2026</p>
            </div>
          </div>
          <div className="upcoming-list">
            {events.map((event) => (
              <article
                className={`upcoming-event ${event.active ? "" : "disabled"}`}
                key={event.id}
              >
                <div className="upcoming-date">
                  <strong>{event.date.split(" ")[0]}</strong>
                  <span>{event.date.split(" ")[1] ?? "oct"}</span>
                </div>
                <div className="upcoming-copy">
                  <strong>{event.title}</strong>
                  <span>
                    <Clock3 size={13} />
                    {event.time}
                  </span>
                  <small>
                    <Repeat2 size={12} />
                    {event.recurrence}
                  </small>
                </div>
                <div className="upcoming-actions">
                  <button
                    type="button"
                    onClick={() => openEdit(event)}
                    aria-label={`Editar ${event.title}`}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEvent(event.id)}
                    className={`mini-switch ${event.active ? "on" : ""}`}
                    role="switch"
                    aria-checked={event.active}
                    aria-label={`${event.active ? "Desactivar" : "Activar"} ${event.title}`}
                  >
                    <span />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    aria-label={`Eliminar ${event.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>

      {editorOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="panel-kicker">
                  {editing ? "Editar evento" : "Nuevo evento"}
                </span>
                <h2>{editing ? editing.title : "Sumalo a tu agenda"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={saveEvent}>
              <label>
                Título
                <input
                  type="text"
                  name="title"
                  defaultValue={editing?.title}
                  placeholder="Ej. Pagar alquiler"
                  required
                />
              </label>
              <label>
                Descripción
                <textarea
                  name="description"
                  defaultValue={editing?.description}
                  rows={3}
                  placeholder="Agregá un poco de contexto"
                />
              </label>
              <div className="form-grid">
                <label>
                  Fecha
                  <input
                    type="date"
                    name="date"
                    defaultValue="2026-10-03"
                    required
                  />
                </label>
                <label>
                  Hora
                  <input
                    type="time"
                    name="time"
                    defaultValue={editing?.time ?? "09:00"}
                    required
                  />
                </label>
              </div>
              <div className="form-grid">
                <label>
                  Repetición
                  <select
                    name="recurrence"
                    defaultValue={editing?.recurrence ?? "No se repite"}
                  >
                    <option>No se repite</option>
                    <option>Semanal</option>
                    <option>Mensual</option>
                  </select>
                </label>
                <label>
                  Avisarme
                  <select name="reminder" defaultValue="60">
                    <option value="0">Al comenzar</option>
                    <option value="15">15 minutos antes</option>
                    <option value="60">1 hora antes</option>
                    <option value="1440">1 día antes</option>
                  </select>
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button-gold">
                  {editing ? "Guardar cambios" : "Crear evento"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
