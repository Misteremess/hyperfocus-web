import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none transition focus:border-white/30";

const selectClass =
  "w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px] text-white outline-none transition focus:border-white/30 cursor-pointer";

const textareaClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none transition focus:border-white/30 resize-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-white/30">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/30">
        ▾
      </div>
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
          <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
          <motion.circle
            cx="32" cy="32" r="28"
            stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none"
            strokeDasharray="176"
            initial={{ strokeDashoffset: 176 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotate: -90, transformOrigin: "32px 32px" }}
          />
          <motion.path
            d="M20 32 L28 40 L44 24"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">Recibido</p>
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">Mensaje enviado</h3>
        <p className="max-w-[260px] text-[13px] leading-[1.7] text-white/40">
          Te respondemos en menos de 48 horas. Revisa también tu carpeta de spam.
        </p>
      </motion.div>

      <motion.button
        onClick={onReset}
        className="mt-2 rounded-full border border-white/10 px-5 py-2 text-[12px] text-white/40 transition hover:border-white/30 hover:text-white/70"
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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-red-400">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="flex-1 text-[12px] text-red-300">{message}</p>
      <button onClick={onClose} className="text-red-400/50 transition hover:text-red-300">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  comoNosConocio: string;
  ayuda: string;
  compromiso: string;
  hito: string;
  inversion: string;
};

const EMPTY: FormState = {
  nombre: "", empresa: "", email: "", telefono: "", comoNosConocio: "",
  ayuda: "", compromiso: "", hito: "", inversion: "",
};

const RATE_LIMIT_KEY = "hf_last_contact";
const RATE_LIMIT_MS = 30_000;

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [accepted, setAccepted] = useState(false);
  const [botField, setBotField] = useState(""); // honeypot — debe quedar vacío
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

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

    setSending(true);

    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          empresa: form.empresa,
          email: form.email,
          telefono: form.telefono,
          comoNosConocio: form.comoNosConocio,
          ayuda: form.ayuda,
          compromiso: form.compromiso,
          hito: form.hito,
          inversion: form.inversion,
          company_url: botField,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Error desconocido");
      }

      try { localStorage.setItem(RATE_LIMIT_KEY, String(Date.now())); } catch {}
      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg || "No se pudo enviar el mensaje. Por favor, escríbenos directamente a info@hyperfocus.es");
    } finally {
      setSending(false);
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
    <section className="bg-[#040506] min-h-screen flex flex-col lg:flex-row">

      {/* ── Left: invitation ─────────────────────────────────── */}
      <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-20 pt-28 pb-12 sm:pt-32 sm:pb-16 lg:w-1/2 lg:sticky lg:top-0 lg:h-screen">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
          Contacto
        </p>
        <h1 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
          ¿Empezamos algo grande juntos?
        </h1>
        <p className="mt-6 max-w-sm text-[15px] leading-[1.75] text-white/40">
          Cuéntanos tu proyecto. Revisamos cada mensaje personalmente y respondemos en menos de 48 horas.
        </p>
        <div className="mt-10 space-y-5">
          {[
            "Rellena el formulario con tu proyecto",
            "Te respondemos en menos de 48 h",
            "Primera llamada sin compromiso",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-4 text-[13px] text-white/35">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] text-white/40">
                {i + 1}
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: form ──────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center border-t border-white/5 lg:border-t-0 lg:border-l px-6 sm:px-8 lg:px-14 xl:px-16 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:w-1/2">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full transition-all duration-700"
          style={{
            filter: sent ? "blur(12px)" : "none",
            opacity: sent ? 0.1 : 1,
            pointerEvents: sent ? "none" : "auto",
          }}
        >
          <AnimatePresence>
            {error && (
              <ErrorBanner message={error} onClose={() => setError(null)} />
            )}
          </AnimatePresence>

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

          {/* Nombre + Empresa side by side */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Field label="Nombre">
              <input type="text" placeholder="Tu nombre" required maxLength={80}
                value={form.nombre} onChange={set("nombre")} className={inputClass} />
            </Field>
            <Field label="Empresa">
              <input type="text" placeholder="Nombre de la empresa" required maxLength={80}
                value={form.empresa} onChange={set("empresa")} className={inputClass} />
            </Field>
          </div>

          {/* Email + Teléfono side by side */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Field label="Email">
              <input type="email" placeholder="tu@empresa.com" required maxLength={120}
                value={form.email} onChange={set("email")} className={inputClass} />
            </Field>
            <Field label="Teléfono (opcional)">
              <input type="tel" placeholder="+34 600 000 000" maxLength={30}
                value={form.telefono} onChange={set("telefono")} className={inputClass} />
            </Field>
          </div>

          <Field label="¿Cómo nos has conocido?">
            <SelectWrapper>
              <select required value={form.comoNosConocio} onChange={set("comoNosConocio")} className={selectClass}>
                <option value="" disabled>Selecciona una opción</option>
                <option>Búsqueda en Google</option>
                <option>Referido por alguien</option>
                <option>Redes sociales</option>
                <option>Evento o conferencia</option>
                <option>Artículo o publicación</option>
                <option>Otro</option>
              </select>
            </SelectWrapper>
          </Field>

          <Field label="¿En qué podemos ayudarte?">
            <textarea
              placeholder="Cuéntanos tu proyecto, qué necesitas y cualquier detalle relevante..."
              required
              maxLength={2000}
              rows={5}
              value={form.ayuda}
              onChange={set("ayuda")}
              className={textareaClass}
            />
          </Field>

          <Field label="Tipo de compromiso">
            <SelectWrapper>
              <select required value={form.compromiso} onChange={set("compromiso")} className={selectClass}>
                <option value="" disabled>Selecciona una opción</option>
                <option>Proyecto puntual</option>
                <option>Colaboración continua</option>
                <option>Consultoría puntual</option>
                <option>Aún explorando opciones</option>
              </select>
            </SelectWrapper>
          </Field>

          <Field label="Hito clave o fecha de inicio">
            <input type="text" placeholder="Ej. Lanzamiento en Q3 2026" required maxLength={120}
              value={form.hito} onChange={set("hito")} className={inputClass} />
          </Field>

          <Field label="Rango de inversión previsto">
            <input type="text" placeholder="Ej. 15.000 €, aún por definir..." required maxLength={120}
              value={form.inversion} onChange={set("inversion")} className={inputClass} />
          </Field>

          <label className="mt-1 flex items-start gap-2.5 text-[12px] leading-[1.6] text-white/40">
            <input
              type="checkbox"
              required
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-white"
            />
            <span>
              He leído y acepto la{" "}
              <a href="/privacidad" className="text-white/70 underline underline-offset-2 transition hover:text-white">
                política de privacidad
              </a>
              . Tus datos se usan solo para responder a tu solicitud.
            </span>
          </label>

          <div className="pt-1">
            <button
              type="submit"
              disabled={sending || !accepted}
              className="relative w-full rounded-xl bg-white py-3.5 text-[14px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Enviando…
                </span>
              ) : (
                "Enviar mensaje"
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-white/20">
              Todos los campos son obligatorios
            </p>
          </div>
        </form>

        <AnimatePresence>
          {sent && <SentOverlay onReset={handleReset} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
