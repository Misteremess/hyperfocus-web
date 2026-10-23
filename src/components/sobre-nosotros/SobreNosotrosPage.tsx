// @refresh reset
import { MotionConfig, motion } from "motion/react";
import FounderCards from "../team/FounderCards";
import TeamGallery from "../ui/TeamGallery";
import ClientCards from "../ui/ClientCards";
import { SITE } from "../../data/site";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    number: "01",
    title: "Calidad antes que cantidad",
    desc: "Preferimos hacer pocos proyectos y hacerlos bien. Probamos lo que entregamos y te explicamos cómo funciona para que no dependas de nosotros.",
  },
  {
    number: "02",
    title: "Claridad",
    desc: "Sin jerga innecesaria ni sorpresas: alcance, plazo y precio por escrito, y te avisamos en cuanto algo cambia.",
  },
  {
    number: "03",
    title: "Resultados que se notan",
    desc: "Antes de empezar acordamos qué tiene que mejorar: horas ahorradas, mensajes atendidos, errores que desaparecen. Y lo revisamos al terminar.",
  },
  {
    number: "04",
    title: "Trato directo",
    desc: "Quien te escucha es quien diseña y programa. Sin comerciales, sin capas de gestión y sin subcontratar tu proyecto.",
  },
];

const MILESTONES = [
  {
    year: "2026",
    title: `Nace Hyperfocus en ${SITE.city}`,
    desc: "Ignacio y Máximo montan el estudio para hacer software, IA y automatización con trato directo, sin la distancia de una agencia.",
  },
  {
    year: "2026",
    title: "Elevate, en producción",
    desc: "Lanzamos nuestra plataforma de alertas de licitaciones públicas con IA. La mejoramos cada semana con lo que nos piden sus usuarios.",
  },
  {
    year: "2026",
    title: "Gatalogistic: de Elevate a automatizar su administración",
    desc: "Una empresa de transporte de Toledo que empezó buscando licitaciones con Elevate y con la que ahora analizamos sus procesos para automatizar lo repetitivo.",
  },
  {
    year: "Próximo",
    title: "Lo que viene",
    desc: "Casos de éxito documentados con cifras reales y crecer solo cuando sume, nunca por inercia.",
  },
];

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.12), transparent 65%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-12 pt-32 sm:pt-36 lg:grid-cols-12 lg:items-end lg:px-8">
        <div className="lg:col-span-8">
          <motion.p
            className="mb-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Sobre nosotros
          </motion.p>
          <motion.h1
            className="text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[4rem] lg:leading-[1.03]"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            Somos dos, y hablas siempre con quien programa tu proyecto.
          </motion.h1>
        </div>
        <motion.p
          className="text-[17px] leading-[1.7] text-ink/70 lg:col-span-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          Hyperfocus es un estudio de {SITE.city}. Aceptamos pocos clientes a la vez para poder dedicarnos de verdad a
          cada uno.
        </motion.p>
      </div>

      {/* Fotos reales del equipo */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <TeamGallery />
      </motion.div>
    </section>
  );
}

// ─── Section 2: Values ────────────────────────────────────────────────────────

function ValuesSection() {
  return (
    <section className="border-t border-ink/8 py-16 px-6 sm:py-24 lg:px-8">
      <div className="mb-12 sm:mb-16">
        <motion.p
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/55"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
        >
          Lo que nos define
        </motion.p>
        <motion.h2
          className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.75rem] leading-[1.1]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Cuatro cosas que puedes esperar de nosotros.
        </motion.h2>
      </div>

      <div className="grid gap-px bg-ink/8 sm:grid-cols-2">
        {VALUES.map((value, i) => (
          <motion.div
            key={value.number}
            className="bg-paper p-8 sm:p-10 lg:p-12"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 text-[11px] font-semibold text-ink/65">{value.number}</p>
            <h3 className="mb-4 text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-ink lg:text-[22px]">
              {value.title}
            </h3>
            <p className="text-[14px] leading-[1.75] text-ink/65">{value.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 3: Story ─────────────────────────────────────────────────────────

function StorySection() {
  return (
    <section className="border-t border-ink/8 py-16 px-6 sm:py-24 lg:px-8" id="historia">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="w-full shrink-0 lg:w-[28%]">
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/55"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          >
            Nuestra historia
          </motion.p>
          <motion.h2
            className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Empezamos en 2026.
          </motion.h2>
          <motion.p
            className="mt-5 text-[14px] leading-[1.75] text-ink/65"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Poco tiempo, pero ya con producto propio en producción y clientes reales.
          </motion.p>
        </div>

        <div className="flex-1">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.title}
              className={`flex gap-8 py-7 ${i < MILESTONES.length - 1 ? "border-b border-ink/8" : ""}`}
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px 120px 0px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="w-12 shrink-0 text-[13px] font-semibold tabular-nums text-ink/50 sm:w-14">{m.year}</p>
              <div>
                <p className="text-[14px] font-semibold text-ink/85">{m.title}</p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-ink/65">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Team ──────────────────────────────────────────────────────────

function ClientsSection() {
  return (
    <section className="border-t border-ink/8 py-16 px-6 sm:py-24 lg:px-8" id="clientes">
      <div className="mb-10 sm:mb-12">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/55">Con quién trabajamos</p>
        <h2 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.75rem]">
          Clientes reales, con nombre.
        </h2>
      </div>
      <ClientCards />
    </section>
  );
}

function TeamSection() {
  return (
    <section className="border-t border-ink/8 py-16 px-6 sm:py-24 lg:px-8" id="equipo">
      <div className="mb-12 sm:mb-16">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/55">El equipo</p>
        <h2 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.75rem] leading-[1.1]">
          Ignacio y Máximo.
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-ink/65">
          Uno programa, el otro se asegura de que lo que programamos resuelve tu problema. Los dos estamos en cada
          proyecto desde la primera llamada.
        </p>
      </div>
      <FounderCards />
    </section>
  );
}

// ─── Section 5: CTA ──────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="border-t border-ink/8 py-20 px-6 sm:py-28 lg:px-8" id="careers">
      <div className="relative overflow-hidden rounded-3xl border border-ink/8 bg-ink/[0.02] px-8 py-16 sm:px-12 sm:py-20 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(79,214,255,0.10) 0%, transparent 60%)" }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 35%, rgba(79,214,255,0.04) 50%, transparent 65%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <motion.p
            className="text-[10px] font-semibold uppercase tracking-[0.26em] text-ink/55"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          >
            ¿Trabajamos juntos?
          </motion.p>

          <motion.h2
            className="max-w-2xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.5rem]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Cuéntanos qué te quita tiempo y te decimos con sinceridad si podemos ayudarte.
          </motion.h2>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            <a
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 bg-ink/5 px-7 py-3 text-[14px] font-medium text-ink transition-all duration-200 hover:border-ink/55 hover:bg-ink/12"
            >
              Hablar con nosotros
              <span className="text-[11px] opacity-60">→</span>
            </a>
            <a
              href="mailto:info@hyperfocus.es"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 px-7 py-3 text-[14px] text-ink/65 transition-all duration-200 hover:border-ink/25 hover:text-ink"
            >
              info@hyperfocus.es
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SobreNosotrosPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-paper text-ink">
        <HeroSection />
        <ValuesSection />
        <TeamSection />
        <StorySection />
        <ClientsSection />
        <CtaSection />
      </div>
    </MotionConfig>
  );
}
