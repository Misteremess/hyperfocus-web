// @refresh reset
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "100%", label: "Desarrollo in-house. Sin subcontratas ni dependencias externas." },
  { value: "<3", label: "Semanas hasta la primera versión funcional en staging." },
  { value: "1:1", label: "Trato directo con quien diseña y programa tu producto." },
  { value: "0", label: "Cajas negras. Código, decisiones y avances siempre visibles." },
];

const STACK = [
  "TypeScript", "React", "Next.js", "Node.js", "Python",
  "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "GCP", "Prisma",
  "GraphQL", "REST", "WebSockets", "Tailwind CSS",
];

const STACK_LOOP = [...STACK, ...STACK];

const SERVICES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    label: "Plataformas SaaS",
    desc: "Aplicaciones web multi-tenant con autenticación, billing, onboarding y paneles de administración listos para escalar.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    label: "APIs y backends",
    desc: "APIs REST y GraphQL de alto rendimiento, diseñadas para ser consumidas por frontends, móviles o sistemas de terceros.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    label: "Herramientas internas",
    desc: "Dashboards, paneles de control y herramientas operativas a medida que reemplazan hojas de cálculo y procesos manuales.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "Infraestructura y DevOps",
    desc: "Configuración de entornos, CI/CD, monitorización y escalado automático para que tu software funcione sin intervención.",
  },
];

const PROCESS_ROWS = [
  {
    title: "Discovery y arquitectura",
    desc: "Analizamos el problema de negocio, definimos la arquitectura técnica y acordamos el alcance antes de escribir una sola línea de código.",
  },
  {
    title: "Diseño de producto",
    desc: "Diseñamos los flujos, componentes e interfaces de usuario con fidelidad suficiente para validar antes de implementar.",
  },
  {
    title: "Desarrollo iterativo",
    desc: "Sprints cortos con entregables reales. Despliegues continuos a staging para que puedas probar y dar feedback desde el primer día.",
  },
  {
    title: "Despliegue y soporte",
    desc: "Lanzamiento a producción con documentación completa, monitorización activa y soporte técnico post-entrega.",
  },
];

type Project = {
  name: string;
  tag: string;
  from: string;
  to: string;
  accent: string;
  images?: string[];
};

const PROJECTS: Project[] = [
  {
    name: "ChillPocket — App de finanzas personales",
    tag: "Producto propio · React Native",
    from: "from-indigo-600/40",
    to: "to-slate-950/70",
    accent: "rgba(99,102,241,0.18)",
    images: [
      "/images/chillpocket/home.webp",
      "/images/chillpocket/movimientos.webp",
      "/images/chillpocket/analitica.webp",
      "/images/chillpocket/habitos.webp",
      "/images/chillpocket/inversion.webp",
    ],
  },
  { name: "SaaS B2B — Panel de administración y billing", tag: "Next.js + Node.js", from: "from-indigo-700/35", to: "to-slate-950/60", accent: "rgba(99,102,241,0.12)" },
  { name: "Fintech — API de pagos y conciliación bancaria", tag: "Python + PostgreSQL", from: "from-emerald-600/30", to: "to-slate-950/60", accent: "rgba(16,185,129,0.12)" },
  { name: "Salud — Portal de gestión de pacientes", tag: "React + MongoDB", from: "from-sky-600/30", to: "to-indigo-950/60", accent: "rgba(14,165,233,0.12)" },
  { name: "Logística — Dashboard de flota en tiempo real", tag: "WebSockets + Redis", from: "from-amber-600/30", to: "to-slate-950/60", accent: "rgba(245,158,11,0.10)" },
  { name: "Legal — Portal de clientes y gestión documental", tag: "Next.js + Auth", from: "from-rose-600/25", to: "to-purple-950/60", accent: "rgba(244,63,94,0.10)" },
  { name: "E-commerce — Motor de recomendaciones con ML", tag: "Python + FastAPI", from: "from-violet-700/30", to: "to-slate-950/60", accent: "rgba(139,92,246,0.10)" },
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
            Servicios — Software a medida
          </motion.p>

          <motion.h1
            className="text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.04]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            Software que se adapta a tu negocio, no al revés.
          </motion.h1>
        </div>

        <motion.div
          className="lg:flex-1 lg:self-end lg:pb-0.5 lg:text-right"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-md text-[13px] leading-[1.72] text-white/45 lg:ml-auto">
            Construimos plataformas, APIs y herramientas internas que resuelven
            problemas reales — con código limpio, arquitectura sólida y entrega predecible.
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

// ─── Section 2: Stack ─────────────────────────────────────────────────────────

function StackSection() {
  return (
    <section className="py-16 px-6 sm:py-20 lg:px-8">
      <motion.p
        className="mb-8 text-center text-[13px] text-white/28 sm:mb-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px 120px 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Stack moderno, probado en producción y elegido por razones técnicas, no por moda.
      </motion.p>

      {/* Pills — desktop */}
      <div className="hidden flex-wrap items-center justify-center gap-2.5 sm:flex sm:gap-3">
        {STACK.map((tech, i) => (
          <motion.span
            key={tech}
            className="rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-medium text-white/40 transition-colors duration-200 hover:border-white/22 hover:text-white/60"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          >
            {tech}
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
          {STACK_LOOP.map((tech, i) => (
            <span
              key={i}
              className="shrink-0 rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-medium text-white/40"
            >
              {tech}
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

// ─── Section 4: Services ──────────────────────────────────────────────────────

function ServicesSection() {
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
            Qué construimos
          </motion.p>

          <motion.h2
            className="mb-5 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Del backend al producto terminado.
          </motion.h2>

          <motion.p
            className="text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Cubrimos el ciclo completo de desarrollo — desde la arquitectura hasta
            el despliegue — sin subcontratar ni depender de terceros.
          </motion.p>
        </div>

        <div className="flex-1">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.label}
              className="flex items-start gap-4 py-5 border-t border-white/8"
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px 120px 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mt-0.5 shrink-0 text-white/30">{service.icon}</span>
              <div>
                <p className="text-[13px] font-semibold text-white/85">{service.label}</p>
                <p className="mt-1 text-[12px] leading-[1.7] text-white/38">{service.desc}</p>
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
            Cómo trabajamos.
          </motion.h2>
          <motion.p
            className="mt-5 text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Iteraciones cortas, comunicación directa y entregables reales desde la primera semana.
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

function GalleryCard({ project, index }: { project: Project; index: number }) {
  const frameCount = project.images ? project.images.length : CARD_FRAMES;
  const [frame, setFrame] = useState(index % frameCount);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const id = setTimeout(() => {
      intervalId = setInterval(
        () => setFrame((f) => (f + 1) % frameCount),
        project.images ? 2600 : 3200
      );
    }, index * 700);
    return () => {
      clearTimeout(id);
      clearInterval(intervalId);
    };
  }, [index, frameCount, project.images]);

  if (project.images) {
    return (
      <div className="group relative aspect-square w-[72vw] shrink-0 overflow-hidden sm:w-[44vw] lg:w-[33vw]">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.from} ${project.to}`} />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 22%, ${project.accent}, transparent 62%)` }}
        />

        {/* Pantalla del móvil — emerge desde el borde inferior */}
        <div className="absolute left-1/2 top-8 w-[52%] -translate-x-1/2">
          <div className="relative aspect-[721/1550] overflow-hidden rounded-[1.4rem] border border-white/12 bg-black shadow-[0_24px_60px_-18px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
            {project.images.map((src, j) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700"
                style={{ opacity: frame === j ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/15 to-transparent p-5">
          <span className="mb-2 self-start rounded-full border border-white/14 bg-black/35 px-2.5 py-0.5 text-[10px] font-medium text-white/55 backdrop-blur-sm">
            {project.tag}
          </span>
          <p className="text-[14px] font-semibold leading-[1.3] text-white">{project.name}</p>
        </div>

        <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/5" />
      </div>
    );
  }

  return (
    <div className="group relative aspect-square w-[72vw] shrink-0 overflow-hidden sm:w-[44vw] lg:w-[33vw]">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.from} ${project.to} transition-opacity duration-[1400ms]`}
        style={{ opacity: FRAME_OPACITIES[frame % CARD_FRAMES] }}
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

export default function SoftwarePage() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <StackSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <GallerySection />
    </div>
  );
}
