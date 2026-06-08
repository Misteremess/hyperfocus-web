// @refresh reset
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMPANY_LOGOS = [
  { name: "OpenAI",        file: "/images/logos/openai.svg",     w: 300,  h: 81 },
  { name: "Anthropic",     file: "/images/logos/anthropic.svg",  w: 1024, h: 115 },
  { name: "Google Gemini", file: "/images/logos/gemini.svg",     w: 2500, h: 563 },
  { name: "ElevenLabs",   file: "/images/logos/elevenlabs.svg",  w: 694,  h: 90 },
  { name: "Twilio",        file: "/images/logos/twilio.svg",     w: 300,  h: 90 },
  { name: "Meta",          file: "/images/logos/meta.svg",       w: 948,  h: 191 },
];

const STATS = [
  { value: "24/7", label: "Tus clientes atendidos a cualquier hora, sin festivos ni esperas." },
  { value: "<2s", label: "Tiempo de respuesta objetivo en cualquier canal y a cualquier hora." },
  { value: "4", label: "Canales en un mismo agente: WhatsApp, email, web y llamadas." },
  { value: "100%", label: "Conversaciones con la voz, el tono y los límites de tu marca." },
  { value: "0", label: "Colas de espera. Cada mensaje recibe respuesta al instante." },
];

const AGENT_TYPES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "Agente de IA para WhatsApp",
    desc: "Atiende, cualifica y convierte leads en WhatsApp con conversaciones naturales, memoria contextual y personalidad de marca.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Agente de IA para correo",
    desc: "Responde, clasifica y gestiona bandeja de entrada con lenguaje profesional, historial del cliente y escalado inteligente.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    label: "Agente de IA para web — texto y voz",
    desc: "Widget inteligente que combina chat escrito y conversación de voz en tiempo real para soporte y ventas en tu sitio.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Agente de IA para llamadas",
    desc: "Voz ultrarrealista con ElevenLabs que atiende entrantes y ejecuta campañas outbound con naturalidad humana.",
  },
];

const COMPARISON = [
  { feature: "Disponibilidad", others: "Solo horario laboral", us: "24 / 7 / 365 sin interrupciones" },
  { feature: "Canales", others: "1–2 canales aislados", us: "WhatsApp, email, web y llamadas unificados" },
  { feature: "Memoria contextual", others: "Sin contexto entre mensajes", us: "Memoria persistente por cliente y canal" },
  { feature: "Voz personalizada", others: "No disponible", us: "Voz propia de marca con ElevenLabs" },
  { feature: "Integración CRM", others: "Manual o muy limitada", us: "Automática con tu stack existente" },
  { feature: "Tiempo de respuesta", others: "De 2 a 24 horas", us: "Menos de 2 segundos" },
  { feature: "Personalización", others: "Plantillas fijas", us: "IA adaptativa por cliente y contexto" },
];

const PROCESS_ROWS = [
  {
    title: "Investigación y auditorías",
    desc: "Analizamos tus canales actuales, flujos de atención y objetivos de negocio para definir el agente óptimo y sus puntos de integración.",
  },
  {
    title: "Diseño UX",
    desc: "Diseñamos los flujos conversacionales, la personalidad del agente, los puntos de escalado humano y la experiencia completa del cliente.",
  },
  {
    title: "Diseño de la interfaz de usuario",
    desc: "Construimos los interfaces nativos en cada canal — widget web, pantallas de administración y paneles de analítica — bajo tu identidad de marca.",
  },
];

const PROJECTS = [
  { name: "Retail — Atención al cliente omnicanal", tag: "WhatsApp + Email", from: "from-violet-700/35", to: "to-indigo-950/60", accent: "rgba(139,92,246,0.12)" },
  { name: "SaaS — Soporte técnico 24/7", tag: "Web — texto y voz", from: "from-cyan-600/30", to: "to-slate-950/60", accent: "rgba(6,182,212,0.12)" },
  { name: "E-commerce — Recuperación de carrito", tag: "WhatsApp", from: "from-amber-600/30", to: "to-rose-950/60", accent: "rgba(245,158,11,0.10)" },
  { name: "Fintech — Cualificación de leads", tag: "Llamadas", from: "from-rose-600/30", to: "to-purple-950/60", accent: "rgba(244,63,94,0.10)" },
  { name: "Legal — Consultas iniciales", tag: "Email + Web", from: "from-teal-600/25", to: "to-slate-950/60", accent: "rgba(20,184,166,0.10)" },
  { name: "Salud — Citas y seguimiento", tag: "WhatsApp + Llamadas", from: "from-emerald-600/25", to: "to-slate-950/60", accent: "rgba(52,211,153,0.10)" },
];

// ─── Section 1: Hero — media altura de pantalla ────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col overflow-hidden lg:h-[50vh] lg:min-h-0">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/posters/agentes-ia.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/agentes-ia-video.mp4" type="video/mp4" />
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.12) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end gap-8 px-6 pb-10 pt-[96px] lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-8 lg:pt-[72px]">
        {/* Left — headline */}
        <div className="lg:max-w-[52%] lg:self-center">
          <motion.p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Servicios — Agentes de IA
          </motion.p>

          <motion.h1
            className="text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.04]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            Agentes de IA que atienden, venden y fidelizan — sin parar.
          </motion.h1>
        </div>

        {/* Right — tech stack */}
        <motion.div
          className="lg:flex-1 lg:self-end lg:pb-0.5 lg:text-right"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-md text-[13px] leading-[1.72] text-white/45 lg:ml-auto">
            Stack de vanguardia. ElevenLabs para voz ultrarrealista, los modelos
            más potentes de OpenAI, Anthropic y Google, integración nativa con
            tus canales de negocio.
          </p>

          {/* CTA button */}
          <div className="mt-5 flex lg:justify-end">
            <a
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-[14px] font-medium text-white transition-all duration-200 hover:border-white/55 hover:bg-white/10"
            >
              Hablar con nosotros
              <span className="text-[11px] opacity-60">→</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Thin separator */}
      <div className="relative z-10 px-6 lg:px-8">
        <div className="h-px bg-white/12" />
      </div>
    </section>
  );
}

// ─── Section 2: Companies ─────────────────────────────────────────────────────

const LOGOS_LOOP = [...COMPANY_LOGOS, ...COMPANY_LOGOS];

function CompaniesSection() {
  return (
    <section className="py-16 px-6 sm:py-20 lg:px-8">
      <div className="text-center">
        <motion.p
          className="mx-auto mb-10 max-w-2xl text-[13px] text-white/28 sm:mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Las empresas que redefinen la IA mundial alimentan cada agente que construimos.
        </motion.p>

        {/* Logos — desktop (como estaban originalmente) */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-10 lg:gap-x-14">
          {COMPANY_LOGOS.map((co, i) => (
            <motion.div
              key={co.name}
              className="shrink-0"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 120px 0px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={co.file}
                alt={co.name}
                width={co.w}
                height={co.h}
                className="h-6 w-auto object-contain lg:h-7"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.38 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Carrusel horizontal infinito — solo mobile */}
        <div className="overflow-hidden sm:hidden">
          <motion.div
            className="flex items-center gap-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            {LOGOS_LOOP.map((co, i) => (
              <img
                key={i}
                src={co.file}
                alt={co.name}
                width={co.w}
                height={co.h}
                className="h-5 w-auto shrink-0 object-contain"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.38 }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Stats — contador animado 0 → valor ───────────────────────────

function parseStat(raw: string) {
  // Extrae prefijo, número y sufijo: "+38%" → {pre:"+", n:38, suf:"%"}
  const m = raw.match(/^([^0-9]*)(\d+)(.*)$/);
  if (!m) return { pre: "", n: 0, suf: raw };
  return { pre: m[1], n: parseInt(m[2], 10), suf: m[3] };
}

function StatItem({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  const { pre, n: target, suf } = parseStat(stat.value);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setTimeout(() => {
          const duration = 2800;
          let start: number | null = null;
          const tick = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4); // ease-out quart
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, 1000);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 120px 0px" }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <p
        className="text-[2.5rem] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[3rem]"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {pre}{count}{suf}
      </p>
      <p className="mt-3 text-[13px] leading-[1.65] text-white/32">{stat.label}</p>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-20 sm:px-16 lg:px-24">
      <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-5">
        {STATS.map((stat, i) => (
          <StatItem key={stat.value} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Section 4: Demo — agentes estáticos, no clickables ──────────────────────

function DemoSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8">
      <div className="flex items-start gap-8 lg:gap-12">
        {/* Left panel */}
        <div className="w-full shrink-0 lg:w-[36%]">
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/25"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          >
            Demo
          </motion.p>

          <motion.p
            className="mb-10 text-[15px] leading-[1.78] text-white/42"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Misma inteligencia, experiencia óptima en cada canal. Cada agente habla
            el idioma nativo de su punto de contacto.
          </motion.p>

          {/* Agentes estáticos — separados por raya fina */}
          <div>
            {AGENT_TYPES.map((agent, i) => (
              <motion.div
                key={agent.label}
                className="flex items-start gap-4 py-5 border-t border-white/8"
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px 120px 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="mt-0.5 shrink-0 text-white/30">{agent.icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-white/85">{agent.label}</p>
                  <p className="mt-1 text-[12px] leading-[1.7] text-white/38">{agent.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right panel — video */}
        <motion.div
          className="relative hidden aspect-video flex-1 overflow-hidden rounded-2xl border border-white/8 bg-white/4 lg:block"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/images/posters/agentes-ia.webp"
            className="h-full w-full object-cover"
          >
            <source src="/videos/agentes-ia-video.mp4" type="video/mp4" />
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          <div className="absolute bottom-5 left-5">
            <span className="rounded-full border border-white/14 bg-black/50 px-3 py-1 text-[11px] text-white/45 backdrop-blur-sm">
              Demo interactiva — próximamente
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 5: Comparison table ─────────────────────────────────────────────

function ComparisonSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8">
      <div className="mb-12 text-center sm:mb-16">
        <motion.h2
          className="text-[1.75rem] font-semibold tracking-[-0.035em] text-white sm:text-3xl lg:text-[2.75rem] leading-[1.1] lg:leading-[1.08]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          No todos los agentes de IA son iguales.
        </motion.h2>
        <motion.p
          className="mt-4 text-[14px] text-white/32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Esto es lo que nos diferencia de las soluciones estándar del mercado.
        </motion.p>
      </div>

      {/* Mobile: tarjetas apiladas por característica */}
      <div className="mx-auto flex max-w-md flex-col gap-3 md:hidden">
        {COMPARISON.map((row, i) => (
          <motion.div
            key={row.feature}
            className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="border-b border-white/8 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {row.feature}
            </p>
            <div className="grid grid-cols-2 divide-x divide-white/6">
              <div className="px-4 py-3">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">Otros</p>
                <p className="text-[13px] leading-snug text-white/35">{row.others}</p>
              </div>
              <div className="bg-[#4FD6FF]/[0.04] px-4 py-3">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD6FF]/55">Hyperfocus</p>
                <p className="text-[13px] font-medium leading-snug text-white/85">{row.us}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: tabla de tres columnas con columna destacada */}
      <div className="mx-auto hidden max-w-4xl md:block">
        {/* Column headers */}
        <motion.div
          className="mb-3 grid grid-cols-[1.6fr_2fr_2fr] px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/18">Competencia</p>
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/22">Otros proveedores</p>
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4FD6FF]/60">Hyperfocus</p>
        </motion.div>

        {/* Table body */}
        <div className="relative">
          {/* Frosted glass column — Hyperfocus */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 rounded-2xl"
            style={{
              width: "calc(100% * 2 / 5.6)",
              background: "rgba(255,255,255,0.028)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
          {/* Glimmer top */}
          <div
            className="pointer-events-none absolute right-0 top-0 overflow-hidden rounded-2xl"
            style={{ width: "calc(100% * 2 / 5.6)", height: "120px" }}
          >
            <motion.div
              className="absolute left-1/2 -top-10 -translate-x-1/2 h-28 w-40 rounded-full"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(79,214,255,0.18) 0%, transparent 72%)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          {/* Sweep shimmer */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 overflow-hidden rounded-2xl"
            style={{ width: "calc(100% * 2 / 5.6)" }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, transparent 30%, rgba(79,214,255,0.055) 50%, transparent 70%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            />
          </div>

          {COMPARISON.map((row, i) => (
            <motion.div
              key={row.feature}
              className={`grid grid-cols-[1.6fr_2fr_2fr] items-center px-4 py-5 ${i > 0 ? "border-t border-white/6" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 120px 0px" }}
              transition={{ duration: 0.5, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[13px] font-medium text-white/45">{row.feature}</p>
              <p className="text-center text-[13px] text-white/28">{row.others}</p>
              <p className="relative z-10 text-center text-[13px] font-medium text-white/85">{row.us}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Process ───────────────────────────────────────────────────────

function ProcessSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="w-full shrink-0 lg:w-[28%]">
          <motion.h2
            className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Lo que hacemos.
          </motion.h2>
          <motion.p
            className="mt-5 text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            De la auditoría al despliegue. Un proceso probado para construir
            agentes que funcionan desde el primer día.
          </motion.p>
          <motion.a
            href="/contacto"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/22 px-6 py-2.5 text-[14px] font-medium text-white transition-all duration-200 hover:border-white/55 hover:bg-white/8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            Empezar proyecto
            <span className="text-[11px] opacity-55">→</span>
          </motion.a>
        </div>

        <div className="flex-1">
          {PROCESS_ROWS.map((step, i) => (
            <motion.div
              key={step.title}
              className={`flex items-start gap-8 py-8 ${i < PROCESS_ROWS.length - 1 ? "border-b border-white/8" : ""}`}
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px 120px 0px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mt-0.5 w-5 shrink-0 text-[11px] font-semibold text-white/18">0{i + 1}</span>
              <div>
                <h3 className="text-[16px] font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.72] text-white/38">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 7: Gallery — marquee horizontal infinito ────────────────────────

const FRAME_OPACITIES = [1, 0.72, 0.5];
const CARD_FRAMES = FRAME_OPACITIES.length;

function GalleryCard({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) {
  const [frame, setFrame] = useState(index % CARD_FRAMES);

  useEffect(() => {
    const id = setTimeout(() => {
      const intervalId = setInterval(() => setFrame((f) => (f + 1) % CARD_FRAMES), 3200);
      return () => clearInterval(intervalId);
    }, index * 700);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <div className="group relative aspect-square w-[72vw] shrink-0 overflow-hidden sm:w-[44vw] lg:w-[33vw]">
      {/* Gradient siempre visible — transición CSS en opacity */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.from} ${project.to} transition-opacity duration-[1400ms]`}
        style={{ opacity: FRAME_OPACITIES[frame] }}
      />

      {/* Abstract UI mockup */}
      <div className="absolute inset-6 flex flex-col gap-3 opacity-20">
        <div className="flex gap-2">
          <div className="h-2 w-16 rounded-full bg-white/60" />
          <div className="h-2 w-10 rounded-full bg-white/30" />
        </div>
        <div className="mt-2 h-px w-full bg-white/20" />
        <div className="flex flex-1 gap-3">
          <div className="flex flex-col gap-2 w-1/3">
            {[70, 55, 80, 45].map((w, j) => (
              <div key={j} className="h-1.5 rounded-full bg-white/40" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="flex-1 rounded-xl bg-white/8" />
        </div>
      </div>

      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${project.accent}, transparent 65%)`,
          opacity: 0.4,
        }}
      />

      {/* Bottom info */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5">
        <span className="mb-2 self-start rounded-full border border-white/14 bg-black/35 px-2.5 py-0.5 text-[10px] font-medium text-white/50 backdrop-blur-sm">
          {project.tag}
        </span>
        <p className="text-[14px] font-semibold leading-[1.3] text-white">{project.name}</p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/5" />
    </div>
  );
}

function GallerySection() {
  return (
    <section className="border-t border-white/8 py-16 sm:py-24">
      {/* Header con padding */}
      <div className="mb-10 flex items-end justify-between gap-6 px-6 sm:mb-12 lg:px-8">
        <motion.h2
          className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Ejemplos de lo que
          <br />
          construimos.
        </motion.h2>
        <motion.a
          href="/contacto"
          className="text-[13px] text-white/30 transition-colors hover:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Cuéntanos tu proyecto →
        </motion.a>
      </div>

      {/* Marquee: una fila, scroll horizontal infinito */}
      <div className="overflow-hidden">
        <div className="hf-marquee flex">
          {/* Dos copias para el loop continuo sin salto */}
          {[...PROJECTS, ...PROJECTS].map((project, i) => (
            <GalleryCard
              key={`${project.name}-${i}`}
              project={project}
              index={i % PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function AgentesIAPage() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <CompaniesSection />
      <StatsSection />
      <DemoSection />
      <ComparisonSection />
      <ProcessSection />
      <GallerySection />
    </div>
  );
}
