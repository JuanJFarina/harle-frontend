import {
  ArrowRight,
  AudioLines,
  BellRing,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  Image as ImageIcon,
  LockKeyhole,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { plans } from "@/lib/demo-data";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const faqs = [
  {
    question: "¿Es un chatbot más?",
    answer:
      "No. Es un compañero que podés personalizar, que aprende tus preferencias y puede volver a escribirte cuando hay algo importante para vos.",
  },
  {
    question: "¿Dónde hablo con el asistente?",
    answer:
      "El día a día ocurre en Telegram. Podés mandarle texto, notas de voz, audio e imágenes sin aprender una aplicación nueva.",
  },
  {
    question: "¿Puede escribirme por su cuenta?",
    answer:
      "Sí. Vos decidís si querés sus check-ins y con qué frecuencia. También podés desactivarlos cuando quieras.",
  },
  {
    question: "¿Qué puede hacer con mis finanzas?",
    answer:
      "Registra gastos y reintegros, entiende compras en cuotas y te muestra resúmenes simples para que sepas adónde se va tu plata.",
  },
  {
    question: "¿Cómo funcionan los recordatorios?",
    answer:
      "Creás eventos únicos, semanales o mensuales y elegís con cuánta anticipación querés recibir el aviso por Telegram.",
  },
  {
    question: "¿Mis datos son privados?",
    answer:
      "Cada cuenta está aislada. El producto está pensado para que siempre puedas controlar tu perfil, tus datos y la autonomía del asistente.",
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand-link">
            <BrandMark />
          </Link>
          <nav className="header-nav" aria-label="Navegación principal">
            <a href="#funciones">Qué hace</a>
            <a href="#planes">Planes</a>
            <a href="#preguntas">Preguntas</a>
          </nav>
          <div className="header-actions">
            <Link href="/ingresar" className="text-link">
              Ingresar
            </Link>
            <Link href="/registro" className="button button-small button-gold">
              Empezar
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} />
              Tu IA, realmente a tu manera
            </div>
            <h1>
              Un compañero de IA que{" "}
              <span className="gold-text">aprende de vos.</span>
            </h1>
            <p className="hero-lead">
              Personalizalo, hablale como quieras y dejá que te ayude con tu
              plata, tu agenda y esas cosas que no querés olvidar.
            </p>
            <div className="hero-actions">
              <Link href="/registro" className="button button-gold button-large">
                Empezar gratis
                <ArrowRight size={18} />
              </Link>
              <a href="#funciones" className="button button-ghost button-large">
                Ver cómo funciona
              </a>
            </div>
            <div className="hero-notes">
              <span>
                <Check size={15} />
                Sin tarjeta
              </span>
              <span>
                <Check size={15} />
                Lo controlás vos
              </span>
              <span>
                <Check size={15} />
                En Telegram
              </span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Conversación de ejemplo">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="telegram-badge">
              <Send size={27} fill="currentColor" />
            </div>
            <div className="phone">
              <div className="phone-top">
                <span className="phone-speaker" />
              </div>
              <div className="phone-screen">
                <div className="chat-header">
                  <span className="chat-avatar">
                    <BrainCircuit size={18} />
                  </span>
                  <span>
                    <strong>Tu compañero</strong>
                    <small>en línea</small>
                  </span>
                </div>
                <div className="chat-body">
                  <div className="message message-in">
                    Buen día. Hoy vence internet y a las 16:30 tenés dentista.
                    ¿Querés que revisemos los gastos de la semana?
                    <small>09:12</small>
                  </div>
                  <div className="message message-out">
                    Sí, pero primero recordame pagar internet.
                    <small>09:13</small>
                  </div>
                  <div className="message message-in short">
                    Listo, te aviso a las 11 ✨
                    <small>09:13</small>
                  </div>
                </div>
                <div className="chat-input">
                  <span>Mensaje</span>
                  <AudioLines size={17} />
                </div>
              </div>
            </div>
            <div className="floating-chip chip-memory">
              <BrainCircuit size={17} />
              <span>
                <small>Aprendió</small>
                Preferís respuestas cortas
              </span>
            </div>
            <div className="floating-chip chip-reminder">
              <BellRing size={17} />
              <span>
                <small>Próximo aviso</small>
                Internet · 11:00
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-inner">
          <p>Un solo compañero para tu día a día</p>
          <div className="trust-items">
            <span>
              <MessageCircle size={18} />
              Texto
            </span>
            <span>
              <AudioLines size={18} />
              Audio
            </span>
            <span>
              <ImageIcon size={18} />
              Imágenes
            </span>
            <span>
              <LockKeyhole size={18} />
              Privado
            </span>
          </div>
        </div>
      </section>

      <section id="funciones" className="section">
        <div className="container">
          <div className="section-heading centered">
            <div className="eyebrow">Mucho más que respuestas</div>
            <h2>Te conoce. Te acompaña. Te simplifica.</h2>
            <p>
              No tenés que aprender flujos ni llenar planillas. Hablale como le
              hablarías a alguien que ya entiende tu contexto.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card feature-card-main">
              <div className="feature-icon">
                <BrainCircuit size={24} />
              </div>
              <span className="card-kicker">Tu compañero</span>
              <h3>Tan personal como vos quieras</h3>
              <p>
                Elegí cómo habla, qué tono usa y con qué frecuencia querés que
                vuelva a contactarte. Con el tiempo, aprende tus preferencias.
              </p>
              <div className="preference-card">
                <div>
                  <span className="preference-label">Estilo de respuesta</span>
                  <strong>Directo y cálido</strong>
                </div>
                <span className="status-dot">Activo</span>
              </div>
              <div className="frequency-row">
                <span>Check-ins</span>
                <div>
                  <button type="button">Baja</button>
                  <button type="button" className="selected">
                    Media
                  </button>
                  <button type="button">Alta</button>
                </div>
              </div>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={24} />
              </div>
              <span className="card-kicker">Siempre bajo tu control</span>
              <h3>Autonomía, sin perder el control</h3>
              <p>
                Puede hacer seguimiento y avisarte cosas importantes. Vos
                decidís cuándo participa y podés cambiarlo en cualquier momento.
              </p>
              <div className="control-list">
                <span>
                  <Check size={16} />
                  Frecuencia configurable
                </span>
                <span>
                  <Check size={16} />
                  Acciones transparentes
                </span>
                <span>
                  <Check size={16} />
                  Datos aislados por cuenta
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-deep">
        <div className="container">
          <div className="use-case">
            <div className="use-case-copy">
              <div className="feature-icon">
                <WalletCards size={24} />
              </div>
              <span className="card-kicker">Finanzas personales</span>
              <h2>Entendé tu plata sin vivir en una planilla.</h2>
              <p>
                Registrá gastos hablando, seguí tus compras en cuotas y mirá
                resúmenes simples para tomar mejores decisiones.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={17} />
                  Gastos y reintegros en segundos
                </li>
                <li>
                  <Check size={17} />
                  Compras de 2 a 12 cuotas
                </li>
                <li>
                  <Check size={17} />
                  Resúmenes por mes y categoría
                </li>
              </ul>
            </div>
            <div className="dashboard-preview finance-preview">
              <div className="preview-header">
                <div>
                  <small>Gastos de septiembre</small>
                  <strong>$ 284.750</strong>
                </div>
                <span className="trend-pill">−8% vs. agosto</span>
              </div>
              <div className="chart">
                <span style={{ height: "36%" }} />
                <span style={{ height: "52%" }} />
                <span style={{ height: "43%" }} />
                <span style={{ height: "71%" }} />
                <span style={{ height: "62%" }} />
                <span style={{ height: "84%" }} />
                <span className="active" style={{ height: "68%" }} />
              </div>
              <div className="preview-categories">
                <div>
                  <span className="category-icon category-home">H</span>
                  <span>
                    <strong>Hogar</strong>
                    <small>32% del total</small>
                  </span>
                  <b>$ 91.120</b>
                </div>
                <div>
                  <span className="category-icon category-shop">C</span>
                  <span>
                    <strong>Compras</strong>
                    <small>24% del total</small>
                  </span>
                  <b>$ 68.340</b>
                </div>
              </div>
            </div>
          </div>

          <div className="use-case use-case-reverse">
            <div className="use-case-copy">
              <div className="feature-icon">
                <CalendarDays size={24} />
              </div>
              <span className="card-kicker">Agenda personal</span>
              <h2>Que acordarte de todo deje de depender de vos.</h2>
              <p>
                Guardá eventos únicos o recurrentes y recibí avisos por
                Telegram en el momento que elijas.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={17} />
                  Eventos únicos, semanales o mensuales
                </li>
                <li>
                  <Check size={17} />
                  Recordatorios con anticipación
                </li>
                <li>
                  <Check size={17} />
                  Todo en tu zona horaria
                </li>
              </ul>
            </div>
            <div className="dashboard-preview calendar-preview">
              <div className="calendar-top">
                <button type="button" aria-label="Mes anterior">
                  ‹
                </button>
                <strong>Octubre 2026</strong>
                <button type="button" aria-label="Mes siguiente">
                  ›
                </button>
              </div>
              <div className="weekdays">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>
              <div className="calendar-days">
                {Array.from({ length: 35 }, (_, index) => {
                  const day = index - 2;
                  return (
                    <span
                      key={index}
                      className={
                        day === 3
                          ? "day-selected"
                          : [1, 6, 13, 20].includes(day)
                            ? "day-event"
                            : day < 1 || day > 31
                              ? "day-muted"
                              : ""
                      }
                    >
                      {day > 0 && day <= 31 ? day : ""}
                    </span>
                  );
                })}
              </div>
              <div className="next-event">
                <span className="event-date">
                  <strong>03</strong>
                  OCT
                </span>
                <span>
                  <strong>Turno con el dentista</strong>
                  <small>16:30 · Avisar 1 hora antes</small>
                </span>
                <BellRing size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className="section pricing-section">
        <div className="container">
          <div className="section-heading centered">
            <div className="eyebrow">Planes simples</div>
            <h2>Elegí cuánto querés usarlo.</h2>
            <p>
              Todos los planes incluyen personalización, finanzas, agenda y
              mensajes multimedia.
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                className={`price-card ${plan.featured ? "featured" : ""}`}
                key={plan.code}
              >
                {plan.featured && (
                  <span className="recommended">Más elegido</span>
                )}
                <h3>{plan.name}</h3>
                <div className="price">
                  <strong>
                    {plan.price === 0 ? "Gratis" : money.format(plan.price)}
                  </strong>
                  {plan.price > 0 && <span>/ mes</span>}
                </div>
                <p>
                  {plan.code === "free"
                    ? "Para conocer a tu compañero."
                    : plan.code === "basic"
                      ? "Para acompañarte todos los días."
                      : "Para usarlo sin estar contando."}
                </p>
                <ul>
                  <li>
                    <Check size={16} />
                    {plan.conversations.toLocaleString("es-AR")} conversaciones
                  </li>
                  <li>
                    <Check size={16} />
                    {plan.notifications} notificaciones de eventos
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
                  href={`/registro?plan=${plan.code}`}
                  className={`button ${plan.featured ? "button-gold" : "button-outline"}`}
                >
                  {plan.price === 0 ? "Empezar gratis" : `Elegir ${plan.name}`}
                  <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
          <p className="pricing-note">
            Los cupos se renuevan cada mes. Sólo cuentan las conversaciones
            completadas y las notificaciones entregadas.
          </p>
        </div>
      </section>

      <section id="preguntas" className="section faq-section">
        <div className="container faq-grid">
          <div className="section-heading">
            <div className="eyebrow">Preguntas frecuentes</div>
            <h2>Antes de empezar, lo importante.</h2>
            <p>
              Si todavía te queda alguna duda, podés escribirnos y te ayudamos.
            </p>
            <a href="mailto:hola@ejemplo.com" className="inline-link">
              Hablar con nosotros
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <ChevronDown size={19} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="signup-band">
        <div className="container signup-grid">
          <div>
            <div className="eyebrow">Tu primer paso</div>
            <h2>Empezá a construir un compañero que sea realmente tuyo.</h2>
            <p>
              Creá tu cuenta gratis. Después vas a poder personalizarlo y
              conectarlo con Telegram.
            </p>
          </div>
          <div className="quick-signup google-signup-card">
            <span className="google-signup-icon">G</span>
            <div>
              <strong>Empezá con Google</strong>
              <p>
                Creá tu cuenta gratuita de forma segura y conectá Telegram en
                el siguiente paso.
              </p>
            </div>
            <Link
              href="/registro"
              className="button button-gold button-large"
            >
              Crear mi cuenta gratis
              <ArrowRight size={18} />
            </Link>
            <small>
              Al continuar, aceptás los términos y la política de privacidad.
            </small>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <BrandMark />
            <p>Un compañero de IA que aprende de vos.</p>
          </div>
          <div className="footer-links">
            <div>
              <strong>Producto</strong>
              <a href="#funciones">Qué hace</a>
              <a href="#planes">Planes</a>
              <a href="#preguntas">Preguntas</a>
            </div>
            <div>
              <strong>Cuenta</strong>
              <Link href="/registro">Registrarme</Link>
              <Link href="/ingresar">Ingresar</Link>
              <Link href="/panel">Ver demo</Link>
            </div>
            <div>
              <strong>Legal</strong>
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
              <a href="mailto:hola@ejemplo.com">Ayuda</a>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>Producto en desarrollo · 2026</span>
          <span>Hecho en Argentina</span>
        </div>
      </footer>
    </main>
  );
}
