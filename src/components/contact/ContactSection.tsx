import { useState, useEffect, useRef, useId } from "react";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import { SITE, LEGAL } from "../../data/site";

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-ink/5 px-4 py-3 text-[14px] text-ink placeholder:text-ink/65 outline-none transition focus:border-ink/50 focus-visible:ring-2 focus-visible:ring-ink/40";

const textareaClass = `${inputClass} resize-none`;

function Field({ label, children }: { label: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-ink/60">
        {label}
      </label>
      {children(id)}
    </div>
  );
}

function SentOverlay({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-center"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.4"
            fill="none"
            strokeDasharray="176"
            initial={{ strokeDashoffset: 176 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotate: -90, transformOrigin: "32px 32px" }}
          />
          <motion.path
            d="M20 32 L28 40 L44 24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="36"
            initial={{ strokeDashoffset: 36 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.4, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/55">Recibido</p>
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-ink">Mensaje enviado</h3>
        <p className="max-w-[260px] text-[13px] leading-[1.7] text-ink/65">
          Te respondemos en menos de 48 horas. Revisa también tu carpeta de spam.
        </p>
      </motion.div>

      <motion.button
        onClick={onReset}
        className="mt-2 rounded-full border border-ink/10 px-5 py-2 text-[12px] text-ink/65 transition hover:border-ink/30 hover:text-ink/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1 }}
      >
        Enviar otro mensaje
      </motion.button>
    </motion.div>
  );
}

function ErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="shrink-0 text-red-400"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="flex-1 text-[12px] text-red-300">{message}</p>
      <button onClick={onClose} className="text-red-400/50 transition hover:text-red-300">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}

type FormState = {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
};

const EMPTY: FormState = { nombre: "", email: "", telefono: "", mensaje: "" };

const RATE_LIMIT_KEY = "hf_last_contact";
const RATE_LIMIT_MS = 30_000;

// ── Cloudflare Turnstile ────────────────────────────────────────────────────
// Clave pública del widget (modo invisible, configurado en Cloudflare). Sin
// clave no se carga nada y el backend tampoco exige token.
const TURNSTILE_SITE_KEY: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

function loadTurnstile(): Promise<Turnstile> {
  const w = window as unknown as { turnstile?: Turnstile };
  if (w.turnstile) return Promise.resolve(w.turnstile);
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = TURNSTILE_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => (w.turnstile ? resolve(w.turnstile) : reject()));
    script.addEventListener("error", () => reject());
  });
}

function useTurnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !containerRef.current) return;
        widgetId.current = ts.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          language: "es",
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      const ts = (window as unknown as { turnstile?: Turnstile }).turnstile;
      if (ts && widgetId.current) ts.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  // Cada token es de un solo uso: se pide uno nuevo tras cada intento.
  const reset = () => {
    const ts = (window as unknown as { turnstile?: Turnstile }).turnstile;
    setToken("");
    if (ts && widgetId.current) ts.reset(widgetId.current);
  };

  return { containerRef, token, reset, enabled: TURNSTILE_SITE_KEY !== "" };
}

// Primera capa informativa RGPD (art. 13 RGPD / recomendación AEPD).
function PrivacyNotice() {
  const rows = [
    ["Responsable", `${LEGAL.owner} (Hyperfocus)`],
    ["Finalidad", "Responder a tu mensaje y, si lo pides, preparar una propuesta."],
    ["Legitimación", "Medidas precontractuales a petición tuya (art. 6.1.b RGPD)."],
    ["Destinatarios", "No se ceden datos. Encargados: Hostinger (correo) y Cloudflare (anti-robots)."],
    ["Derechos", "Acceso, rectificación, supresión, oposición, limitación y portabilidad en info@hyperfocus.es."],
  ];
  return (
    <div className="mt-2 rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3 text-[11px] leading-[1.6] text-ink/55">
      <p className="mb-2 font-semibold uppercase tracking-[0.14em] text-ink/60">
        Información básica sobre protección de datos
      </p>
      <dl className="space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="sm:flex sm:gap-3">
            <dt className="shrink-0 font-medium text-ink/70 sm:w-28">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2">
        Más información en la{" "}
        <a href="/privacidad" className="text-ink/80 underline underline-offset-2 hover:text-ink">
          política de privacidad
        </a>
        .
      </p>
    </div>
  );
}

function DirectContact() {
  const items = [
    { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { label: "Teléfono", value: SITE.phone, href: SITE.phoneHref },
    { label: "Teléfono", value: SITE.phone2, href: SITE.phone2Href },
    { label: "WhatsApp", value: `Escríbenos al ${SITE.phone}`, href: SITE.whatsapp, external: true },
    { label: "WhatsApp", value: `Escríbenos al ${SITE.phone2}`, href: SITE.whatsapp2, external: true },
    ...(SITE.booking ? [{ label: "Llamada", value: "Reserva 20 minutos", href: SITE.booking, external: true }] : []),
  ];
  return (
    <div className="mt-10 border-t border-ink/10 pt-8">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/50">O directamente</p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.href} className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-[14px]">
            <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.14em] text-ink/65">{it.label}</span>
            <a
              href={it.href}
              {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-ink/85 underline-offset-4 transition hover:text-ink hover:underline"
            >
              {it.value}
            </a>
          </li>
        ))}
        <li className="flex flex-wrap items-baseline gap-x-4 text-[14px]">
          <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.14em] text-ink/65">Dónde</span>
          <span className="text-ink/85">
            {SITE.city}, {SITE.region}. Trabajamos en remoto con toda España.
          </span>
        </li>
      </ul>
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [accepted, setAccepted] = useState(false);
  const [botField, setBotField] = useState(""); // honeypot — debe quedar vacío
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstile = useTurnstile();
  const consentId = useId();

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Honeypot: si un bot rellena el campo oculto, abortamos en silencio.
    if (botField) return;

    if (!accepted) {
      setError("Debes aceptar la política de privacidad para enviar el formulario.");
      return;
    }

    // Rate-limit básico anti-spam (30 s entre envíos por navegador).
    try {
      const last = Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
      if (Date.now() - last < RATE_LIMIT_MS) {
        setError("Acabas de enviar un mensaje. Espera unos segundos antes de volver a intentarlo.");
        return;
      }
    } catch {}

    if (turnstile.enabled && !turnstile.token) {
      setError("Estamos comprobando que no eres un robot. Espera un segundo y vuelve a enviar.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          company_url: botField,
          turnstileToken: turnstile.token,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Error desconocido");
      }

      try {
        localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      } catch {}
      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg || `No se pudo enviar el mensaje. Escríbenos directamente a ${SITE.email}`);
    } finally {
      setSending(false);
      if (turnstile.enabled) turnstile.reset();
    }
  };

  const handleReset = () => {
    setForm(EMPTY);
    setAccepted(false);
    setBotField("");
    setSent(false);
    setError(null);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-paper min-h-screen flex flex-col lg:flex-row">
        {/* ── Left: invitation + contacto directo ──────────────── */}
        <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-20 pt-28 pb-12 sm:pt-32 sm:pb-16 lg:w-1/2 lg:sticky lg:top-0 lg:min-h-screen">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/50">Contacto</p>
          <h1 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-4xl lg:text-5xl">
            Cuéntanos qué necesitas.
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-[1.75] text-ink/65">
            Te contesta una de las dos personas que harán el proyecto, normalmente en menos de 48 horas laborables. La
            primera llamada no te compromete a nada.
          </p>

          <DirectContact />
        </div>

        {/* ── Right: form ──────────────────────────────────────── */}
        <div className="relative flex flex-col justify-center border-t border-ink/5 lg:border-t-0 lg:border-l px-6 sm:px-8 lg:px-14 xl:px-16 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-28 lg:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full transition-all duration-700"
            style={{
              filter: sent ? "blur(12px)" : "none",
              opacity: sent ? 0.1 : 1,
              pointerEvents: sent ? "none" : "auto",
            }}
          >
            <AnimatePresence>{error && <ErrorBanner message={error} onClose={() => setError(null)} />}</AnimatePresence>

            {/* Honeypot anti-spam — oculto a usuarios reales */}
            <input
              type="text"
              name="company_url"
              tabIndex={-1}
              autoComplete="off"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <Field label="Nombre">
              {(id) => (
                <input
                  id={id}
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  required
                  maxLength={80}
                  value={form.nombre}
                  onChange={set("nombre")}
                  className={inputClass}
                />
              )}
            </Field>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Field label="Email">
                {(id) => (
                  <input
                    id={id}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@empresa.com"
                    required
                    maxLength={120}
                    value={form.email}
                    onChange={set("email")}
                    className={inputClass}
                  />
                )}
              </Field>
              <Field label="Teléfono (opcional)">
                {(id) => (
                  <input
                    id={id}
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    placeholder="600 000 000"
                    maxLength={30}
                    value={form.telefono}
                    onChange={set("telefono")}
                    className={inputClass}
                  />
                )}
              </Field>
            </div>

            <Field label="Mensaje">
              {(id) => (
                <textarea
                  id={id}
                  name="mensaje"
                  placeholder="Qué te gustaría resolver, qué usáis hoy y cualquier plazo que tengas en mente."
                  required
                  maxLength={3000}
                  rows={6}
                  value={form.mensaje}
                  onChange={set("mensaje")}
                  className={textareaClass}
                />
              )}
            </Field>

            <div className="mt-1 flex items-start gap-2.5 text-[12px] leading-[1.6] text-ink/65">
              <input
                id={consentId}
                type="checkbox"
                required
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-ink"
              />
              <label htmlFor={consentId}>
                He leído y acepto la{" "}
                <a href="/privacidad" className="text-ink/85 underline underline-offset-2 transition hover:text-ink">
                  política de privacidad
                </a>
                .
              </label>
            </div>

            {/* Turnstile: en modo invisible no ocupa espacio; si Cloudflare pide
              interacción, el widget aparece aquí. */}
            {turnstile.enabled && <div ref={turnstile.containerRef} className="max-w-full overflow-hidden" />}

            <div>
              <button
                type="submit"
                disabled={sending || !accepted}
                className="relative w-full rounded-xl bg-ink py-3.5 text-[14px] font-semibold text-paper transition hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Enviando…
                  </span>
                ) : (
                  "Enviar mensaje"
                )}
              </button>
              <p className="mt-3 text-center text-[11px] text-ink/50">
                Todos los campos son obligatorios salvo el teléfono
              </p>
            </div>

            <PrivacyNotice />
          </form>

          <AnimatePresence>{sent && <SentOverlay onReset={handleReset} />}</AnimatePresence>
        </div>
      </section>
    </MotionConfig>
  );
}
