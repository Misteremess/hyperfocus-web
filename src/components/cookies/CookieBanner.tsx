import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "hyperfocus_cookie_consent";

function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {}
  // Notifica al cargador de GTM del layout (carga analítica solo con consentimiento).
  window.dispatchEvent(
    new CustomEvent("hyperfocus:consent-updated", { detail: consent }),
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [prefs, setPrefs] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (loadConsent()) return;

    const isHome = window.location.pathname === "/";

    if (isHome) {
      // Espera al evento que lanza IntroSplash al terminar,
      // luego deja 900 ms para que el fade-in de la página complete.
      const show = () => setTimeout(() => setVisible(true), 900);
      window.addEventListener("hyperfocus:splash-done", show, { once: true });
      // Fallback por si llegamos a home sin IntroSplash (navegación SPA de vuelta)
      const fallback = setTimeout(() => setVisible(true), 5000);
      return () => {
        window.removeEventListener("hyperfocus:splash-done", show as EventListener);
        clearTimeout(fallback);
      };
    } else {
      const t = setTimeout(() => setVisible(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const savePrefs = () => {
    saveConsent(prefs);
    setVisible(false);
  };

  const toggle = (key: "analytics" | "marketing") =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[9998] p-3 sm:p-5"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "110%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl"
            style={{
              background: "rgba(8, 8, 10, 0.55)",
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 64px rgba(0,0,0,0.55)",
            }}
          >
            {/* top edge glow line */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
              }}
            />

            <AnimatePresence mode="wait">
              {!configuring ? (
                <motion.div
                  key="main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">
                      Privacidad
                    </p>
                    <p className="text-[13px] leading-[1.65] text-white/55">
                      Usamos cookies propias y de terceros para analizar el uso de la web y mejorar tu experiencia.{" "}
                      <button
                        onClick={() => setConfiguring(true)}
                        className="text-white/70 underline underline-offset-2 transition hover:text-white"
                      >
                        Configurar
                      </button>{" "}
                      o consulta nuestra{" "}
                      <a
                        href="/cookies"
                        className="text-white/70 underline underline-offset-2 transition hover:text-white"
                      >
                        política de cookies
                      </a>
                      .
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={rejectAll}
                      className="rounded-xl px-4 py-2 text-[12px] font-medium text-white/35 transition hover:text-white/60"
                      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={acceptAll}
                      className="rounded-xl px-4 py-2 text-[12px] font-semibold text-black transition hover:brightness-90"
                      style={{ background: "rgba(255,255,255,0.92)" }}
                    >
                      Aceptar todas
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="config"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="px-5 py-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">
                      Configurar preferencias
                    </p>
                    <button
                      onClick={() => setConfiguring(false)}
                      className="text-[11px] text-white/25 transition hover:text-white/50"
                    >
                      ← Volver
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <CookieToggle
                      label="Necesarias"
                      description="Imprescindibles para el funcionamiento de la web."
                      checked={true}
                      disabled
                    />
                    <CookieToggle
                      label="Analíticas"
                      description="Medir tráfico y comportamiento de visitantes."
                      checked={prefs.analytics}
                      onChange={() => toggle("analytics")}
                    />
                    <CookieToggle
                      label="Marketing"
                      description="Publicidad relevante en otros sitios web."
                      checked={prefs.marketing}
                      onChange={() => toggle("marketing")}
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={rejectAll}
                      className="rounded-xl px-4 py-2 text-[12px] font-medium text-white/35 transition hover:text-white/60"
                      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      Rechazar opcionales
                    </button>
                    <button
                      onClick={savePrefs}
                      className="rounded-xl px-4 py-2 text-[12px] font-semibold text-black transition hover:brightness-90"
                      style={{ background: "rgba(255,255,255,0.92)" }}
                    >
                      Guardar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Toggle switch ────────────────────────────────────────────────────────── */

function CookieToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  const id = `cookie-toggle-${label.toLowerCase()}`;

  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-3.5"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      {/* Label row */}
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className={[
            "text-[12px] font-medium",
            disabled ? "text-white/40 cursor-not-allowed" : "text-white/75 cursor-pointer",
          ].join(" ")}
        >
          {label}
        </label>

        {/* Track */}
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={!disabled ? onChange : undefined}
          disabled={disabled}
          className="relative shrink-0 focus-visible:outline-none"
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            background: checked
              ? disabled
                ? "rgba(255,255,255,0.30)"
                : "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "background 0.22s ease",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {/* Thumb */}
          <span
            style={{
              position: "absolute",
              top: 3,
              left: 3,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: checked
                ? disabled
                  ? "rgba(0,0,0,0.5)"
                  : "#000"
                : "rgba(255,255,255,0.35)",
              transform: checked ? "translateX(18px)" : "translateX(0px)",
              transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1), background 0.22s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] leading-[1.55] text-white/28">{description}</p>
    </div>
  );
}
