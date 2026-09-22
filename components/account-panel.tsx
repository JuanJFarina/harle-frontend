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
import { FormEvent, useState } from "react";

export function AccountPanel() {
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
          <h1>Buenas tardes, Juan.</h1>
          <p>Acá tenés un resumen de tu cuenta y tu compañero.</p>
        </div>
        <button type="button" className="button button-outline">
          Ver planes
          <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="usage-grid">
        <article className="usage-card">
          <span className="usage-icon">
            <MessageCircle size={20} />
          </span>
          <div>
            <small>Conversaciones</small>
            <strong>154</strong>
            <span>de 480 usadas</span>
          </div>
          <div className="usage-progress">
            <span style={{ width: "32%" }} />
          </div>
          <b>326 disponibles</b>
        </article>
        <article className="usage-card">
          <span className="usage-icon">
            <BellRing size={20} />
          </span>
          <div>
            <small>Notificaciones</small>
            <strong>18</strong>
            <span>de 60 usadas</span>
          </div>
          <div className="usage-progress">
            <span style={{ width: "30%" }} />
          </div>
          <b>42 disponibles</b>
        </article>
        <article className="usage-card plan-summary-card">
          <span className="usage-icon">
            <CreditCard size={20} />
          </span>
          <div>
            <small>Plan actual</small>
            <strong>Básico</strong>
            <span>ARS 5.000 / mes</span>
          </div>
          <div className="renewal-row">
            <span>Próxima renovación</span>
            <b>22 oct 2026</b>
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
                <input type="text" defaultValue="Juan" />
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
            <span className="connection-status">
              <i />
              Conectado
            </span>
            <h2>Telegram</h2>
            <p>
              Tu cuenta está conectada. Ya podés hablar con tu compañero desde
              el bot.
            </p>
            <div className="connected-account">
              <span>JF</span>
              <div>
                <strong>Juan F.</strong>
                <small>@juan_demo</small>
              </div>
            </div>
            <button type="button" className="button button-outline">
              Abrir Telegram
              <ArrowUpRight size={17} />
            </button>
          </section>

          <section className="panel-card subscription-card">
            <div className="panel-card-header">
              <span className="panel-card-icon">
                <CreditCard size={20} />
              </span>
              <div>
                <h2>Suscripción</h2>
                <p>Activa desde el 22 sep 2026.</p>
              </div>
            </div>
            <dl>
              <div>
                <dt>Plan</dt>
                <dd>Básico</dd>
              </div>
              <div>
                <dt>Importe</dt>
                <dd>ARS 5.000 / mes</dd>
              </div>
              <div>
                <dt>Período actual</dt>
                <dd>22 sep — 22 oct</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd className="active-text">Activa</dd>
              </div>
            </dl>
            <button type="button" className="text-action">
              Administrar suscripción
              <ArrowUpRight size={15} />
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
