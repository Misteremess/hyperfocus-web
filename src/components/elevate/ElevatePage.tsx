// @refresh reset
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ELEVATE } from "../../data/site";
import {
  ELEVATE_STEPS,
  ELEVATE_SHOWCASE,
  ELEVATE_STATS,
  ELEVATE_CATEGORIES,
  ELEVATE_FAQ,
  ELEVATE_GREEN,
} from "./ElevateContent";
import { Reveal, SectionHeading, PrimaryButton, SecondaryButton } from "../ui/Reveal";
import BrowserFrame from "../ui/BrowserFrame";

const EASE = [0.22, 1, 0.36, 1] as const;
const GLOW = `radial-gradient(ellipse at 70% 20%, ${ELEVATE_GREEN}0.18) 0%, transparent 55%)`;

// ─── Piezas reutilizables (también en la portada) ───────────────────────────

export function ElevateSteps() {
  return (
    <ol className="relative grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-3">
      {ELEVATE_STEPS.map((step, i) => (
        <li
          key={step.title}
          className="group relative bg-paper p-7 transition-colors duration-500 hover:bg-emerald-950/30 sm:p-8"
        >
          <Reveal delay={i * 0.08}>
            <p className="mb-5 flex items-center gap-3 text-[12px] font-semibold tabular-nums text-emerald-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10">
                {i + 1}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-emerald-400/40 to-transparent" aria-hidden="true" />
            </p>
            <h3 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
            <p className="text-[14px] leading-[1.7] text-ink/65">{step.desc}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

/** Captura del panel con inclinación 3D que se endereza al hacer scroll. */
export function ElevateHeroShot() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    <div ref={ref} className="relative" style={{ perspective: 1400 }}>
      <div
        className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10 blur-3xl"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${ELEVATE_GREEN}0.28) 0%, transparent 65%)` }}
        aria-hidden="true"
      />
      <motion.div style={{ rotateX, scale, transformOrigin: "50% 100%" }}>
        <BrowserFrame src={ELEVATE.screenshots.dashboard.src} alt={ELEVATE.screenshots.dashboard.alt} priority />
      </motion.div>
    </div>
  );
}

// ─── Secciones ──────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-32 sm:pb-20 sm:pt-40 lg:px-8">
      <div className="pointer-events-none absolute inset-0" style={{ background: GLOW }} />
      {/* Rejilla tenue de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,27,51,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(11,27,51,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.p
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Producto propio · En producción
        </motion.p>
        <motion.h1
          className="text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[4.25rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.06, ease: EASE }}
        >
          Las licitaciones públicas que encajan con tu empresa,{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
            sin buscarlas a mano.
          </span>
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-[16px] leading-[1.75] text-ink/70"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14, ease: EASE }}
        >
          <strong className="font-semibold text-ink">Elevate</strong> revisa cada día la Plataforma de Contratación del
          Sector Público y te avisa solo de lo que encaja con tu negocio, ordenado por una puntuación de encaje
          calculada con IA.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
        >
          <PrimaryButton href={ELEVATE.url} external>
            Probar Elevate gratis
          </PrimaryButton>
          <SecondaryButton href="#como-funciona">Ver cómo funciona</SecondaryButton>
        </motion.div>
        <p className="mt-4 text-[12px] text-ink/55">Plan gratuito sin tarjeta de crédito.</p>
      </div>

      <motion.div
        className="relative z-10 mx-auto mt-14 max-w-6xl sm:mt-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
      >
        <ElevateHeroShot />
      </motion.div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-ink/10 bg-ink/[0.02] px-6 py-10 sm:py-12 lg:px-8">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {ELEVATE_STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <dt className="text-[1.9rem] font-semibold tracking-[-0.04em] text-ink sm:text-[2.4rem]">{s.value}</dt>
            <dd className="mt-1 text-[13px] leading-[1.55] text-ink/60">{s.label}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

function CategoriesTicker() {
  const loop = [...ELEVATE_CATEGORIES, ...ELEVATE_CATEGORIES];
  return (
    <div
      className="overflow-hidden py-6"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}
      aria-hidden="true"
    >
      <div className="hf-marquee flex gap-3" style={{ animationDuration: "48s" }}>
        {loop.map((c, i) => (
          <span
            key={i}
            className="shrink-0 rounded-full border border-ink/10 bg-ink/[0.03] px-4 py-2 text-[13px] text-ink/65"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function Problem() {
  return (
    <section className="px-6 py-16 sm:py-24 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <SectionHeading
          className="!mb-0"
          eyebrow="Por qué existe"
          title="Licitar no debería empezar por horas de búsqueda."
        />
        <Reveal className="space-y-5 text-[15px] leading-[1.8] text-ink/70">
          <p>
            Las empresas que licitan con frecuencia dedican cada semana horas a revisar plataformas públicas, filtrar
            anuncios que no les sirven y vigilar plazos. Es trabajo necesario, pero no es el que gana contratos.
          </p>
          <p>
            Elevate automatiza esa parte: describes qué haces y la plataforma se encarga de encontrar, puntuar y
            avisarte. Así el tiempo se va a preparar buenas ofertas.
          </p>
        </Reveal>
      </div>
      <div className="mt-12">
        <CategoriesTicker />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <SectionHeading eyebrow="Cómo funciona" title="Tres pasos y te olvidas de buscar." />
      <ElevateSteps />
    </section>
  );
}

function Showcase() {
  return (
    <section className="border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Dentro de Elevate"
        title="Así se ve por dentro."
        intro="Capturas reales de la aplicación. Haz clic en cualquiera para verla en grande."
      />
      <div className="space-y-20 sm:space-y-28">
        {ELEVATE_SHOWCASE.map((item, i) => {
          const shot = ELEVATE.screenshots[item.key];
          const reverse = i % 2 === 1;
          return (
            <div key={item.key} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <motion.div
                className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}
                initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="relative">
                  <div
                    className="pointer-events-none absolute -inset-6 -z-10 blur-3xl"
                    style={{
                      background: `radial-gradient(ellipse at ${reverse ? "70%" : "30%"} 50%, ${ELEVATE_GREEN}0.16) 0%, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                  <BrowserFrame src={shot.src} alt={shot.alt} />
                </div>
              </motion.div>
              <Reveal className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {item.eyebrow}
                </p>
                <h3 className="text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[1.9rem]">
                  {item.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.75] text-ink/65">{item.desc}</p>
                <ul className="mt-6 space-y-3">
                  {item.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[14px] leading-[1.6] text-ink/75">
                      <span
                        className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[10px] text-emerald-700"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="planes" className="scroll-mt-20 border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Planes"
        title="Empieza gratis. Crece cuando lo necesites."
        intro="Empieza con el plan gratuito, sin tarjeta, y pasa a Pro cuando necesites más perfiles, alertas inmediatas o el asistente Noa."
      />
      <div className="mx-auto grid max-w-xl gap-5 lg:max-w-none lg:grid-cols-3">
        {ELEVATE.plans.map((plan, i) => (
          <Reveal
            key={plan.name}
            delay={i * 0.08}
            className={`relative flex flex-col rounded-2xl border p-7 ${
              plan.highlight
                ? "border-emerald-400/50 bg-emerald-400/[0.07] shadow-[0_0_70px_rgba(16,185,129,0.14)]"
                : "border-ink/10 bg-ink/[0.03]"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-3 py-1 text-[11px] font-bold text-paper">
                Más popular
              </span>
            )}
            <p
              className={`text-[12px] font-semibold uppercase tracking-[0.2em] ${plan.highlight ? "text-emerald-700" : "text-ink/55"}`}
            >
              {plan.name}
            </p>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-[2.4rem] font-semibold tracking-[-0.03em] text-ink">{plan.price}</span>
              {plan.period && <span className="text-[13px] text-ink/60">{plan.period}</span>}
            </p>
            <p className="mt-1 text-[13px] text-ink/60">{plan.desc}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.items.map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] text-ink/80">
                  <span className="text-emerald-700" aria-hidden="true">
                    ✓
                  </span>
                  {it}
                </li>
              ))}
            </ul>
            <a
              href={ELEVATE.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition ${
                plan.highlight
                  ? "bg-ink text-paper hover:bg-ink/90"
                  : "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/10"
              }`}
            >
              {plan.cta}{" "}
              <span aria-hidden="true" className="text-[11px]">
                →
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-ink/55">
        Precios con IVA incluido. ¿Dudas sobre qué plan te conviene?{" "}
        <a href="/contacto" className="text-ink/80 underline underline-offset-4">
          Escríbenos
        </a>
        .
      </p>
    </section>
  );
}

function Faq() {
  return (
    <section className="border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que suele preguntarse." />
      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {ELEVATE_FAQ.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium text-ink">
              {item.q}
              <span
                aria-hidden="true"
                className="text-xl leading-none text-emerald-700 transition duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-[14px] leading-[1.75] text-ink/65">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function BuiltByUs() {
  return (
    <section className="border-t border-ink/10 px-6 py-20 sm:py-28 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-ink/[0.02] px-6 py-14 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0" style={{ background: GLOW }} />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(105deg, transparent 35%, ${ELEVATE_GREEN}0.06) 50%, transparent 65%)` }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <Reveal className="relative z-10 max-w-2xl">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/55">Hecho por Hyperfocus</p>
          <h2 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.5rem]">
            Lo hemos diseñado, programado y lo mantenemos nosotros.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-ink/65">
            Recogida diaria de datos públicos, IA que puntúa y responde, avisos por email y una aplicación web con
            cuentas y planes. Es el mismo tipo de trabajo que hacemos para nuestros clientes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href={ELEVATE.url} external>
              Ir a Elevate
            </PrimaryButton>
            <SecondaryButton href="/contacto">Quiero algo parecido</SecondaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function ElevatePage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-x-clip bg-paper text-ink">
        <Hero />
        <Stats />
        <Problem />
        <HowItWorks />
        <Showcase />
        <Plans />
        <Faq />
        <BuiltByUs />
      </main>
    </MotionConfig>
  );
}
