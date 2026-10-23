import { SITE, ELEVATE } from "../../data/site";
import { Reveal, SectionHeading, PrimaryButton, SecondaryButton } from "../ui/Reveal";
import { ElevateHeroShot } from "../elevate/ElevatePage";
import { ELEVATE_STATS } from "../elevate/ElevateContent";
import FounderCards from "../team/FounderCards";
import ClientCards from "../ui/ClientCards";
import SpotlightCard from "../ui/SpotlightCard";
import { WhatsAppIcon } from "../ui/Icons";

// ─── 1. Qué resolvemos ──────────────────────────────────────────────────────

const ICONS = {
  sync: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  chat: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  ),
  grid: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
};

const PROBLEMS = [
  {
    icon: ICONS.sync,
    color: "3,105,161",
    title: "Horas copiando datos de un programa a otro",
    desc: "Pedidos, facturas, fichas de clientes o informes que alguien rehace a mano cada semana. Conectamos tus herramientas para que los datos vayan solos.",
    href: "/servicios/automatizacion",
    cta: "Automatización",
  },
  {
    icon: ICONS.chat,
    color: "109,40,217",
    title: "Mensajes de clientes que se quedan sin contestar",
    desc: "WhatsApp, email o la web llenos de preguntas repetidas. Un agente de IA responde lo habitual con el tono de tu marca y te pasa lo que necesita a una persona.",
    href: "/servicios/agentes-ia",
    cta: "Agentes de IA",
  },
  {
    icon: ICONS.grid,
    color: "4,120,87",
    title: "Un Excel que ya no da más de sí",
    desc: "Cuando la hoja de cálculo se convierte en el sistema de la empresa. Hacemos la herramienta a medida que necesitas, con acceso para tu equipo.",
    href: "/servicios/software",
    cta: "Software a medida",
  },
];

export function ProblemsSection() {
  return (
    <section id="que-resolvemos" className="scroll-mt-20 border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <SectionHeading eyebrow="Qué resolvemos" title="Tres problemas que vemos en casi todas las pymes." />
      <div className="grid gap-4 md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08} className="h-full">
            <SpotlightCard href={p.href} color={p.color}>
              <span
                className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border"
                style={{
                  color: `rgb(${p.color})`,
                  borderColor: `rgba(${p.color},0.35)`,
                  background: `rgba(${p.color},0.08)`,
                }}
              >
                {p.icon}
              </span>
              <h3 className="mb-3 text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink">{p.title}</h3>
              <p className="flex-1 text-[14px] leading-[1.7] text-ink/65">{p.desc}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-ink/80 transition group-hover:text-ink">
                {p.cta}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <a href="/servicios/webs" className="text-[14px] text-ink/70 underline-offset-4 hover:text-ink hover:underline">
          También hacemos webs y aplicaciones web →
        </a>
      </Reveal>
    </section>
  );
}

// ─── 2. Elevate como prueba ─────────────────────────────────────────────────

export function ElevateTeaser() {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 85% 30%, rgba(16,185,129,0.14) 0%, transparent 55%)" }}
      />
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading
            className="!mb-8"
            eyebrow="Nuestro producto · Elevate"
            title="No solo lo contamos: Elevate es nuestro y está en marcha."
            intro="Elevate avisa a las empresas de las licitaciones públicas que encajan con su negocio. Revisa a diario la Plataforma de Contratación del Sector Público, puntúa cada anuncio con IA y manda alertas por email. Lo hemos diseñado y programado de principio a fin."
          />
          <Reveal>
            <dl className="mb-9 grid grid-cols-2 gap-x-6 gap-y-5">
              {ELEVATE_STATS.slice(0, 2).map((s) => (
                <div key={s.label}>
                  <dt className="text-[1.6rem] font-semibold tracking-[-0.03em] text-emerald-700">{s.value}</dt>
                  <dd className="mt-1 text-[12px] leading-[1.5] text-ink/60">{s.label}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/elevate">Conocer Elevate</PrimaryButton>
              <SecondaryButton href={ELEVATE.url} external>
                Probarlo gratis
              </SecondaryButton>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <ElevateHeroShot />
        </div>
      </div>
    </section>
  );
}

// ─── 2b. Clientes ───────────────────────────────────────────────────────────

export function ClientsSection() {
  return (
    <section className="border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <SectionHeading eyebrow="Con quién trabajamos" title="Empresas de aquí que ya trabajan con nosotros." />
      <ClientCards />
    </section>
  );
}

// ─── 3. Cómo trabajamos ─────────────────────────────────────────────────────

const STEPS = [
  {
    title: "Hablamos",
    desc: "Una llamada sin compromiso para entender el problema, lo que ya usáis y qué sería un buen resultado para ti.",
  },
  {
    title: "Te proponemos algo concreto",
    desc: "Alcance, plazo y precio por escrito. Presupuesto cerrado si el proyecto está bien definido o bolsa de horas si prefieres ir paso a paso.",
  },
  {
    title: "Construimos y entregamos por partes",
    desc: "Ves avances desde el principio y puedes probarlos. Al terminar, el código y los accesos son tuyos y seguimos disponibles para el mantenimiento.",
  },
];

export function HowWeWorkSection() {
  return (
    <section className="border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <SectionHeading eyebrow="Cómo trabajamos" title="Sin sorpresas: tres pasos y siempre por escrito." />
      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
        {/* Línea que une los pasos (escritorio) */}
        <span
          className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-ink/0 via-ink/25 to-ink/0 md:block"
          aria-hidden="true"
        />
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative">
            <Reveal delay={i * 0.12}>
              <span className="relative z-10 mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 bg-paper text-[14px] font-semibold text-ink shadow-[0_0_0_6px_black]">
                {i + 1}
              </span>
              <h3 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-ink">{s.title}</h3>
              <p className="max-w-sm text-[14px] leading-[1.7] text-ink/65">{s.desc}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── 4. Quiénes somos ───────────────────────────────────────────────────────

export function WhoWeAreSection() {
  return (
    <section className="border-t border-ink/10 px-6 py-16 sm:py-24 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            className="!mb-6"
            eyebrow="Quiénes somos"
            title="Somos dos, y eso es una ventaja."
            intro={`Hyperfocus es un estudio pequeño de ${SITE.city}. No hay comerciales ni capas intermedias: quien te escucha es quien diseña y programa tu proyecto. Por eso aceptamos pocos clientes a la vez.`}
          />
          <Reveal>
            <a
              href="/sobre-nosotros"
              className="text-[14px] text-ink/75 underline-offset-4 hover:text-ink hover:underline"
            >
              Más sobre nosotros →
            </a>
          </Reveal>
        </div>
        <FounderCards />
      </div>
    </section>
  );
}

// ─── 5. Contacto ────────────────────────────────────────────────────────────

export function ContactCtaSection() {
  return (
    <section className="border-t border-ink/10 px-6 py-20 sm:py-28 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-ink/[0.02] px-6 py-14 sm:px-12 sm:py-20">
        <div
          className="hf-aurora pointer-events-none absolute -inset-1/2"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(79,214,255,0.10), rgba(167,139,250,0.08), rgba(16,185,129,0.10), rgba(79,214,255,0.10))",
          }}
          aria-hidden="true"
        />
        <Reveal className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/60">Contacto</p>
            <h2 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.5rem]">
              ¿Tienes un proceso que te quita tiempo? Cuéntanoslo.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-ink/70">
              Escríbenos a{" "}
              <a href={`mailto:${SITE.email}`} className="text-ink underline-offset-4 hover:underline">
                {SITE.email}
              </a>
              {", "}llámanos al{" "}
              <a href={SITE.phoneHref} className="whitespace-nowrap text-ink underline-offset-4 hover:underline">
                {SITE.phone}
              </a>
              {" o al "}
              <a href={SITE.phone2Href} className="whitespace-nowrap text-ink underline-offset-4 hover:underline">
                {SITE.phone2}
              </a>
              {", o usa el formulario."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/contacto">Ir al formulario</PrimaryButton>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-6 py-3 text-[14px] font-medium text-emerald-700 transition hover:border-emerald-300/70 hover:bg-emerald-400/20"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
