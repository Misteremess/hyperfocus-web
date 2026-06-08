// @refresh reset
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "48h", label: "Del primer análisis a un primer flujo funcionando en marcha." },
  { value: "24/7", label: "Tus procesos siguen corriendo aunque tú no estés delante." },
  { value: "100%", label: "A medida de tu stack actual. Sin migrar de herramientas." },
  { value: "1:1", label: "Hablas directamente con quien diseña la automatización." },
];

const TOOLS = [
  "Make", "n8n", "Zapier", "Airtable", "HubSpot", "Salesforce",
  "Notion", "Slack", "Stripe", "Google Workspace", "Pipedrive", "Monday.com",
  "Twilio", "SendGrid", "REST APIs", "Webhooks",
];

const TOOLS_LOOP = [...TOOLS, ...TOOLS];

const AUTOMATION_TYPES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    label: "Procesos internos",
    desc: "Aprobaciones, notificaciones, asignación de tareas y reportes automáticos que eliminan el trabajo manual y liberan a tu equipo.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    label: "Integraciones entre sistemas",
    desc: "Conectamos tu CRM, ERP, plataformas de soporte y marketing para que los datos fluyan sin fricción ni intervención manual.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    label: "Reporting y analítica",
    desc: "Dashboards actualizados en tiempo real, informes periódicos automáticos y alertas configuradas según los umbrales de tu negocio.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    label: "Flujos con IA",
    desc: "Automatización clásica potenciada con modelos de lenguaje para clasificar, generar contenido y tomar decisiones contextuales.",
  },
];

const PROCESS_ROWS = [
  {
    title: "Auditoría y mapeo",
    desc: "Analizamos cada proceso actual, identificamos cuellos de botella, volumetría y ROI esperado para priorizar qué automatizar primero con mayor impacto.",
  },
  {
    title: "Diseño del flujo",
    desc: "Diseñamos la arquitectura completa — herramientas, integraciones, manejo de errores y logging — antes de implementar una sola pieza.",
  },
  {
    title: "Despliegue y monitorización",
    desc: "Implementamos en staging, validamos con datos reales y desplegamos con alertas y dashboards para garantizar que todo funciona.",
  },
];

const PROJECTS = [
  { name: "SaaS — Sincronización automática de datos entre plataformas", tag: "API + n8n", from: "from-violet-700/35", to: "to-indigo-950/60", accent: "rgba(139,92,246,0.12)" },
  { name: "E-commerce — Gestión de pedidos sin intervención manual", tag: "Shopify + Make", from: "from-teal-600/30", to: "to-slate-950/60", accent: "rgba(20,184,166,0.12)" },
  { name: "Retail — Reporting semanal automatizado", tag: "Google Sheets + Airtable", from: "from-cyan-600/30", to: "to-indigo-950/60", accent: "rgba(6,182,212,0.12)" },
  { name: "Logística — Notificaciones de estado en tiempo real", tag: "Slack + Webhooks", from: "from-amber-600/30", to: "to-slate-950/60", accent: "rgba(245,158,11,0.10)" },
  { name: "Legal — Generación y envío automático de contratos", tag: "PDF + Email", from: "from-rose-600/25", to: "to-purple-950/60", accent: "rgba(244,63,94,0.10)" },
  { name: "Consultoría — CRM automatizado y seguimiento de leads", tag: "HubSpot + n8n", from: "from-emerald-600/25", to: "to-slate-950/60", accent: "rgba(52,211,153,0.10)" },
];

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col overflow-hidden lg:h-[50vh] lg:min-h-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/posters/hero.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-end gap-8 px-6 pb-10 pt-[96px] lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-8 lg:pt-[72px]">
        <div className="lg:max-w-[52%] lg:self-center">
          <motion.p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Servicios — Automatización
          </motion.p>

          <motion.h1
            className="text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.04]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            Automatiza procesos. Libera tu equipo. Escala sin límites.
          </motion.h1>
        </div>

        <motion.div
          className="lg:flex-1 lg:self-end lg:pb-0.5 lg:text-right"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-md text-[13px] leading-[1.72] text-white/45 lg:ml-auto">
            Conectamos tus herramientas, eliminamos trabajo manual y diseñamos flujos
            que operan solos — con fiabilidad industrial y visibilidad total.
          </p>

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

      <div className="relative z-10 px-6 lg:px-8">
        <div className="h-px bg-white/12" />
      </div>
    </section>
  );
}

// ─── Section 2: Tools ─────────────────────────────────────────────────────────

function ToolsSection() {
  return (
    <section className="py-16 px-6 sm:py-20 lg:px-8">
      <motion.p
        className="mb-8 text-center text-[13px] text-white/28 sm:mb-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px 120px 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Trabajamos con el ecosistema de herramientas que ya usa tu empresa.
      </motion.p>

      {/* Pills — desktop */}
      <div className="hidden flex-wrap items-center justify-center gap-2.5 sm:flex sm:gap-3">
        {TOOLS.map((tool, i) => (
          <motion.span
            key={tool}
            className="rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-medium text-white/40 transition-colors duration-200 hover:border-white/22 hover:text-white/60"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.4, delay: i * 0.035, ease: [0.22, 1, 0.36, 1] }}
          >
            {tool}
          </motion.span>
        ))}
      </div>

      {/* Carrusel horizontal infinito — solo mobile */}
      <div className="overflow-hidden sm:hidden">
        <motion.div
          className="flex items-center gap-2.5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {TOOLS_LOOP.map((tool, i) => (
            <span
              key={i}
              className="shrink-0 rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-medium text-white/40"
            >
              {tool}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 3: Stats ────────────────────────────────────────────────────────

function parseStat(raw: string) {
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
            const eased = 1 - Math.pow(1 - p, 4);
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
      <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatItem key={stat.value} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Section 4: Automation types ──────────────────────────────────────────────

function TypesSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="w-full shrink-0 lg:w-[36%]">
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/25"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          >
            Qué automatizamos
          </motion.p>

          <motion.h2
            className="mb-5 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Cuatro áreas, un objetivo: cero trabajo manual.
          </motion.h2>

          <motion.p
            className="text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Ya sea un proceso simple o una cadena compleja de sistemas, diseñamos
            la solución de automatización más adecuada para tu contexto.
          </motion.p>
        </div>

        <div className="flex-1">
          {AUTOMATION_TYPES.map((type, i) => (
            <motion.div
              key={type.label}
              className="flex items-start gap-4 py-5 border-t border-white/8"
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px 120px 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mt-0.5 shrink-0 text-white/30">{type.icon}</span>
              <div>
                <p className="text-[13px] font-semibold text-white/85">{type.label}</p>
                <p className="mt-1 text-[12px] leading-[1.7] text-white/38">{type.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Process ───────────────────────────────────────────────────────

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
            Cómo lo hacemos.
          </motion.h2>
          <motion.p
            className="mt-5 text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Proceso claro, resultados medibles. Sin cajas negras ni sorpresas.
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

// ─── Section 6: Gallery ───────────────────────────────────────────────────────

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
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.from} ${project.to} transition-opacity duration-[1400ms]`}
        style={{ opacity: FRAME_OPACITIES[frame] }}
      />

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

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${project.accent}, transparent 65%)`,
          opacity: 0.4,
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5">
        <span className="mb-2 self-start rounded-full border border-white/14 bg-black/35 px-2.5 py-0.5 text-[10px] font-medium text-white/50 backdrop-blur-sm">
          {project.tag}
        </span>
        <p className="text-[14px] font-semibold leading-[1.3] text-white">{project.name}</p>
      </div>

      <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/5" />
    </div>
  );
}

function GallerySection() {
  return (
    <section className="border-t border-white/8 py-16 sm:py-24">
      <div className="mb-10 flex items-end justify-between gap-6 px-6 sm:mb-12 lg:px-8">
        <motion.h2
          className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 120px 0px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Lo que podemos
          <br />
          automatizar.
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

      <div className="overflow-hidden">
        <div className="hf-marquee flex">
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

export default function AutomatizacionPage() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <ToolsSection />
      <StatsSection />
      <TypesSection />
      <ProcessSection />
      <GallerySection />
    </div>
  );
}
