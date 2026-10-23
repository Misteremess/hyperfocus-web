import { motion } from "motion/react";
import { SITE } from "../../data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

// Datos verificables que se muestran bajo el titular.
const FACTS = [
  { value: "2", label: "personas: hablas con quien programa" },
  { value: "Toledo", label: "estudio local, clientes en toda España" },
  { value: "Elevate", label: "producto propio en producción" },
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      {/* Fondo: rejilla tenue y un halo de color de marca */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,27,51,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,27,51,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.12), transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="lg:col-span-6">
          <motion.p
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-3.5 py-1.5 text-[12px] font-medium text-ink/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Estudio de software en {SITE.city} · desde 2026
          </motion.p>

          <motion.h1
            className="text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Software, IA y automatización para empresas que quieren{" "}
            <span className="hf-gradient-text">hacer menos a mano.</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[520px] text-[17px] leading-[1.7] text-ink/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          >
            Construimos herramientas a medida, agentes de IA y automatizaciones para pymes de toda España. Y las
            mantenemos contigo después de entregarlas.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
          >
            <a
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper shadow-[0_10px_30px_-10px_rgba(11,27,51,0.5)] transition hover:bg-ink/90"
            >
              Cuéntanos tu caso{" "}
              <span aria-hidden="true" className="text-[12px]">
                →
              </span>
            </a>
            <a
              href="#que-resolvemos"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-paper px-6 py-3.5 text-[15px] font-medium text-ink transition hover:border-ink/40"
            >
              Qué resolvemos
            </a>
          </motion.div>

          <motion.dl
            className="mt-12 grid max-w-[560px] grid-cols-3 gap-4 border-t border-ink/10 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            {FACTS.map((f) => (
              <div key={f.value}>
                <dt className="text-[18px] font-semibold tracking-[-0.02em] text-ink sm:text-[22px]">{f.value}</dt>
                <dd className="mt-1 text-[12px] leading-[1.45] text-ink/60 sm:text-[13px]">{f.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="relative lg:col-span-6"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-ink/10 shadow-[0_40px_80px_-30px_rgba(11,27,51,0.35)]">
            <picture>
              <source media="(max-width: 640px)" srcSet="/images/equipo/ambos-trabajando-800.webp" type="image/webp" />
              <img
                src="/images/equipo/ambos-trabajando.webp"
                alt="Ignacio y Máximo, fundadores de Hyperfocus, revisando código juntos en la oficina"
                width={1280}
                height={853}
                fetchPriority="high"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </picture>
          </div>
          {/* Tarjeta flotante: Elevate */}
          <a
            href="/elevate"
            className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper/95 px-4 py-3 shadow-[0_20px_40px_-15px_rgba(11,27,51,0.35)] backdrop-blur transition hover:-translate-y-0.5 sm:left-6"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 17l6-6 4 4 8-8" />
                <path d="M14 7h7v7" />
              </svg>
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-ink">Elevate, nuestro producto</span>
              <span className="block text-[12px] text-ink/60">Alertas de licitaciones con IA →</span>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
