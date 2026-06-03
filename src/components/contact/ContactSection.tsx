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
          Te respondemos en menos de 48 horas.
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

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  comoNosConocio: string;
  ayuda: string;
  compromiso: string;
  hito: string;
  inversion: string;
};

const EMPTY: FormState = {
  nombre: "", empresa: "", email: "", comoNosConocio: "",
  ayuda: "", compromiso: "", hito: "", inversion: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const handleReset = () => { setForm(EMPTY); setSent(false); };

  return (
    <section className="bg-[#040506] min-h-screen flex flex-col lg:flex-row">

      {/* ── Left: invitation ─────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-20 pt-32 pb-16 lg:w-1/2 lg:sticky lg:top-0 lg:h-screen">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
          Contacto
        </p>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white lg:text-5xl">
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
      <div className="relative flex flex-col justify-center border-t border-white/5 lg:border-t-0 lg:border-l px-8 lg:px-14 xl:px-16 pt-16 pb-20 lg:w-1/2">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full transition-all duration-700"
          style={{
            filter: sent ? "blur(12px)" : "none",
            opacity: sent ? 0.1 : 1,
            pointerEvents: sent ? "none" : "auto",
          }}
        >
          {/* Nombre + Empresa side by side */}
          <div className="flex gap-3">
            <Field label="Nombre">
              <input type="text" placeholder="Tu nombre" required
                value={form.nombre} onChange={set("nombre")} className={inputClass} />
            </Field>
            <Field label="Empresa">
              <input type="text" placeholder="Nombre de la empresa" required
                value={form.empresa} onChange={set("empresa")} className={inputClass} />
            </Field>
          </div>

          <Field label="Email">
            <input type="email" placeholder="tu@empresa.com" required
              value={form.email} onChange={set("email")} className={inputClass} />
          </Field>

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

          {/* Textarea for open description */}
          <Field label="¿En qué podemos ayudarte?">
            <textarea
              placeholder="Cuéntanos tu proyecto, qué necesitas y cualquier detalle relevante..."
              required
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
            <input type="text" placeholder="Ej. Lanzamiento en Q3 2025" required
              value={form.hito} onChange={set("hito")} className={inputClass} />
          </Field>

          <Field label="Rango de inversión previsto">
            <input type="text" placeholder="Ej. 15.000 €, aún por definir..." required
              value={form.inversion} onChange={set("inversion")} className={inputClass} />
          </Field>

          <div className="pt-1">
            <button
              type="submit"
              className="w-full rounded-xl bg-white py-3.5 text-[14px] font-semibold text-black transition hover:bg-white/90"
            >
              Enviar mensaje
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
