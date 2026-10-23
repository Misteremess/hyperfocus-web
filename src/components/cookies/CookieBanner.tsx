import { useState, useEffect } from "react";
import { MotionConfig, motion, AnimatePresence } from "motion/react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
};

const STORAGE_KEY = "hyperfocus_cookie_consent";
const OPEN_SETTINGS_EVENT = "hyperfocus:open-cookie-settings";

/** Reabre el panel de preferencias (enlace "Configurar cookies" del pie). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/** Borra las cookies de Google Analytics (_ga y _ga_*) en el host y el dominio raíz. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const rootDomain = host.split(".").slice(-2).join(".");
  const domains = ["", host, "." + host, rootDomain, "." + rootDomain];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) return;
    domains.forEach((d) => {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
    });
  });
}

function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  const hadAnalytics = loadConsent()?.analytics === true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {}
  // Notifica al cargador de GTM del layout (carga analítica solo con consentimiento).
  window.dispatchEvent(new CustomEvent("hyperfocus:consent-updated", { detail: consent }));
  // Retirada del consentimiento: GTM ya está cargado en memoria, así que se
  // borran sus cookies y se recarga para que deje de ejecutarse.
  if (hadAnalytics && !consent.analytics) {
    clearAnalyticsCookies();
    window.location.reload();
  }
}

// Aceptar y rechazar comparten estilo: misma prominencia (Guía de cookies AEPD).
const CHOICE_BUTTON =
  "rounded-xl border border-ink/30 bg-paper px-4 py-2 text-[12px] font-semibold text-ink transition hover:border-ink/60 hover:bg-surface";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [prefs, setPrefs] = useState<ConsentState>({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    const open = () => {
      setPrefs({ necessary: true, analytics: loadConsent()?.analytics === true });
      setConfiguring(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (loadConsent()) return;

    // En portada se espera a la intro, salvo que ya se haya visto en esta sesión.
    const isHome = window.location.pathname === "/" && document.documentElement.dataset.introSeen !== "1";

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
    saveConsent({ necessary: true, analytics: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false });
    setVisible(false);
  };

  const savePrefs = () => {
    saveConsent(prefs);
    setVisible(false);
  };

  const toggleAnalytics = () => setPrefs((p) => ({ ...p, analytics: !p.analytics }));

  return (
    <MotionConfig reducedMotion="user">
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
                background: "rgba(255, 255, 255, 0.97)",
                backdropFilter: "blur(28px) saturate(160%)",
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                border: "1px solid rgba(11,27,51,0.1)",
                boxShadow: "0 24px 60px -20px rgba(11,27,51,0.35)",
              }}
            >
              {/* top edge glow line */}
              <div
                className="h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(3,105,161,0.35) 30%, rgba(3,105,161,0.15) 70%, transparent 100%)",
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
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                        Privacidad
                      </p>
                      <p className="text-[13px] leading-[1.65] text-ink/55">
                        Usamos cookies analíticas de terceros (Google Analytics) solo si las aceptas, para medir el uso
                        de la web.{" "}
                        <button
                          onClick={() => setConfiguring(true)}
                          className="text-ink/70 underline underline-offset-2 transition hover:text-ink"
                        >
                          Configurar
                        </button>{" "}
                        o consulta nuestra{" "}
                        <a
                          href="/cookies"
                          className="text-ink/70 underline underline-offset-2 transition hover:text-ink"
                        >
                          política de cookies
                        </a>
                        .
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={rejectAll} className={CHOICE_BUTTON}>
                        Rechazar
                      </button>
                      <button onClick={acceptAll} className={CHOICE_BUTTON}>
                        Aceptar
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
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                        Configurar preferencias
                      </p>
                      <button
                        onClick={() => setConfiguring(false)}
                        className="text-[11px] text-ink/55 transition hover:text-ink/50"
                      >
                        ← Volver
                      </button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
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
                        onChange={toggleAnalytics}
                      />
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button onClick={rejectAll} className={CHOICE_BUTTON}>
                        Rechazar opcionales
                      </button>
                      <button onClick={savePrefs} className={CHOICE_BUTTON}>
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
    </MotionConfig>
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
        border: "1px solid rgba(11,27,51,0.08)",
        background: "#f4f6f9",
      }}
    >
      {/* Label row */}
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className={[
            "text-[12px] font-medium",
            disabled ? "text-ink/65 cursor-not-allowed" : "text-ink/75 cursor-pointer",
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
            background: checked ? (disabled ? "rgba(11,27,51,0.30)" : "#0369a1") : "rgba(11,27,51,0.12)",
            border: "1px solid rgba(11,27,51,0.08)",
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
              background: "#ffffff",
              transform: checked ? "translateX(18px)" : "translateX(0px)",
              transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1), background 0.22s ease",
              boxShadow: "0 1px 3px rgba(11,27,51,0.35)",
            }}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] leading-[1.55] text-ink/55">{description}</p>
    </div>
  );
}
