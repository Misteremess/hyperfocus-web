import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

/**
 * Captura de pantalla dentro de una ventana de navegador.
 * `src` sin extensión: se sirven `${src}-800.webp` (móvil) y `${src}.webp`.
 * Al hacer clic se abre ampliada.
 */
export default function BrowserFrame({
  src,
  alt,
  url = "elevate.hyperfocus.es",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  url?: string;
  priority?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar captura: ${alt}`}
        className={`group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-ink/15 bg-surface text-left shadow-[0_30px_80px_-30px_rgba(11,27,51,0.45)] transition duration-500 hover:border-ink/30 sm:rounded-2xl ${className}`}
      >
        {/* Barra del navegador */}
        <div className="flex items-center gap-2 border-b border-ink/10 bg-ink/[0.04] px-3 py-2 sm:px-4 sm:py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
          <span className="ml-2 truncate rounded-md bg-ink/[0.06] px-3 py-0.5 text-[10px] text-ink/55 sm:ml-3 sm:text-[11px]">
            {url}
          </span>
        </div>
        <picture>
          <source media="(max-width: 640px)" srcSet={`${src}-800.webp`} type="image/webp" />
          <img
            src={`${src}.webp`}
            alt={alt}
            width={1600}
            height={786}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="block h-auto w-full transition duration-700 group-hover:scale-[1.015]"
          />
        </picture>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-paper/90 p-3 backdrop-blur-sm sm:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <motion.img
                  src={`${src}.webp`}
                  alt={alt}
                  className="max-h-full max-w-full rounded-lg shadow-2xl"
                  initial={{ scale: 0.94 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-full border border-ink/25 bg-paper/60 px-4 py-2 text-[13px] text-ink hover:bg-ink/10"
                >
                  Cerrar
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
