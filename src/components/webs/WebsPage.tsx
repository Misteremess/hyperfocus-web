// @refresh reset
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "100", label: "Objetivo de Lighthouse: rendimiento, accesibilidad y SEO." },
  { value: "<1s", label: "LCP objetivo en producción. La velocidad es prioridad, no un extra." },
  { value: "0", label: "Plantillas genéricas. Cada web se diseña y programa desde cero." },
  { value: "2sem", label: "Tiempo típico de entrega para una landing lista para producción." },
];

const STACK = [
  "Astro", "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Framer Motion", "Sanity CMS", "Contentful", "Shopify", "Stripe",
  "Vercel", "Cloudflare", "WebGL", "Three.js",
];

const STACK_LOOP = [...STACK, ...STACK];

const SERVICES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    ),
    label: "Landings de alta conversión",
    desc: "Páginas de producto, lanzamiento o campaña diseñadas para convertir visitas en leads o ventas con claridad y velocidad.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    label: "Webs corporativas y de producto",
    desc: "Sitios completos con CMS, blog, multiidioma y arquitectura de contenido pensada para crecer sin fricción técnica.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    label: "E-commerce y tiendas digitales",
    desc: "Tiendas rápidas y convertidoras construidas con Shopify o solución custom, con pagos, inventario y experiencia de compra cuidada.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10" />
        <path d="M2 12h10M12 2a15.3 15.3 0 0 1 4 10" />
        <path d="M18 14v4h4" />
        <path d="M22 22 18 18" />
      </svg>
    ),
    label: "Aplicaciones web interactivas",
    desc: "Webs con experiencias complejas — dashboards de datos, configuradores de producto, portales de cliente — con rendimiento nativo.",
  },
];

const PRINCIPLES = [
  {
    number: "01",
    title: "Rendimiento ante todo",
    desc: "Cada milisegundo cuenta. Construimos con Astro y Next.js desde cero, sin plantillas ni frameworks de peso que ralenticen la carga.",
  },
  {
    number: "02",
    title: "Diseño que convierte",
    desc: "La estética es un medio, no un fin. Cada decisión de diseño tiene un argumento de conversión, retención o claridad detrás.",
  },
  {
    number: "03",
    title: "Código que escala",
    desc: "Sin page builders, sin deuda técnica. HTML semántico, CSS moderno y componentes reutilizables que puedes mantener tú mismo.",
  },
];

const PROCESS_ROWS = [
  {
    title: "Estrategia y wireframing",
    desc: "Definimos la arquitectura de información, el journey del usuario y los KPIs de conversión antes de diseñar una sola pantalla.",
  },
  {
    title: "Diseño visual y prototipado",
    desc: "Diseñamos en alta fidelidad con sistema de componentes coherente, motion language y adaptaciones mobile-first validadas.",
  },
  {
    title: "Desarrollo y optimización",
    desc: "Implementamos con máximo rendimiento, SEO técnico, accesibilidad y métricas Core Web Vitals en verde antes del lanzamiento.",
  },
];

const PROJECTS = [
  { name: "Tech startup — Landing de producto con animaciones 3D", tag: "Astro + Three.js", from: "from-violet-700/35", to: "to-indigo-950/60", accent: "rgba(139,92,246,0.12)" },
  { name: "Hyperfocus — Demo de consultora SaaS", tag: "Lovable", from: "from-sky-600/30", to: "to-slate-950/60", accent: "rgba(14,165,233,0.12)", video: "/videos/proyectos-webs/Demo-Consultora-saas.mp4", poster: "/images/posters/demo-consultora.webp" },
  { name: "E-commerce premium — Tienda de moda y accesorios", tag: "Shopify + Custom", from: "from-rose-600/25", to: "to-purple-950/60", accent: "rgba(244,63,94,0.10)" },
  { name: "SaaS — Sitio de marketing con blog y docs", tag: "Astro + Tailwind", from: "from-emerald-600/25", to: "to-slate-950/60", accent: "rgba(52,211,153,0.10)" },
  { name: "Pastelería Caprichosa — Menú y pedidos online", tag: "Lovable", from: "from-amber-600/30", to: "to-slate-950/60", accent: "rgba(245,158,11,0.10)", video: "/videos/proyectos-webs/Demo-Pasteleria-Caprichosa.mp4", poster: "/images/posters/demo-pasteleria.webp" },
  { name: "Restaurante — Reservas y menú digital", tag: "Astro + Stripe", from: "from-teal-600/30", to: "to-indigo-950/60", accent: "rgba(20,184,166,0.12)" },
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
            Servicios — Webs y Aplicaciones
          </motion.p>

          <motion.h1
            className="text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.04]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            Presencia digital que convierte visitas en clientes.
          </motion.h1>
        </div>

        <motion.div
          className="lg:flex-1 lg:self-end lg:pb-0.5 lg:text-right"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-md text-[13px] leading-[1.72] text-white/45 lg:ml-auto">
            Landings, webs corporativas, e-commerce y aplicaciones web construidas
            con código limpio, rendimiento extremo y diseño que trabaja para tu negocio.
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

// ─── Section 2: Stack ────────────────────────────────────────────────────────

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
        Tecnología moderna, rápida y mantenible — sin atajos que pasen factura después.
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

// ─── Section 4: Principles ────────────────────────────────────────────────────

function PrinciplesSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8">
      <motion.p
        className="mb-12 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/25"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px 120px 0px" }}
      >
        Nuestra filosofía
      </motion.p>

      <div className="grid gap-px bg-white/8 sm:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.number}
            className="bg-black p-8 sm:p-10"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 text-[11px] font-semibold text-white/18">{p.number}</p>
            <h3 className="mb-3 text-[18px] font-semibold leading-[1.2] tracking-[-0.025em] text-white">
              {p.title}
            </h3>
            <p className="text-[13px] leading-[1.72] text-white/38">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 5: Services ──────────────────────────────────────────────────────

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
            Qué hacemos
          </motion.p>

          <motion.h2
            className="mb-5 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Todo lo que necesita tu presencia digital.
          </motion.h2>

          <motion.p
            className="text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Desde una landing de una sola página hasta una plataforma web compleja
            con múltiples integraciones — cubrimos todo el espectro.
          </motion.p>

          {/* Stack badges — mobile y desktop */}
          <div className="mt-8 flex flex-wrap gap-2">
            {STACK.slice(0, 8).map((tech, i) => (
              <motion.span
                key={tech}
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/35"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px 120px 0px" }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.03 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
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
            De la idea al lanzamiento.
          </motion.h2>
          <motion.p
            className="mt-5 text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Un proceso ágil con entregables claros en cada fase, sin sorpresas.
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

// ─── Section 7: Gallery ───────────────────────────────────────────────────────

const FRAME_OPACITIES = [1, 0.72, 0.5];
const CARD_FRAMES = FRAME_OPACITIES.length;

// El carrusel duplica cada proyecto para crear el bucle infinito (ver GallerySection).
// Los <video> duplicados son elementos independientes: si cada uno reproduce a su
// ritmo, acaban desincronizados y el "salto" entre copias se nota como un corte feo
// al cerrar el bucle. Este registro mantiene la copia de cada vídeo alineada con la
// primera que se monta, para que ambas muestren siempre el mismo fotograma.
const videoLeaders = new Map<string, HTMLVideoElement>();

function useSyncedVideoRef(src: string | undefined) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!src) return;
    const video = ref.current;
    if (!video) return;

    if (!videoLeaders.has(src)) {
      videoLeaders.set(src, video);
      return () => {
        if (videoLeaders.get(src) === video) videoLeaders.delete(src);
      };
    }

    const leader = videoLeaders.get(src)!;
    const id = window.setInterval(() => {
      if (leader.paused || video.seeking) return;
      const drift = video.currentTime - leader.currentTime;
      if (Math.abs(drift) > 0.12) {
        video.currentTime = leader.currentTime;
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [src]);

  return ref;
}

function GalleryCard({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) {
  const [frame, setFrame] = useState(index % CARD_FRAMES);
  const videoRef = useSyncedVideoRef(project.video);

  useEffect(() => {
    const id = setTimeout(() => {
      const intervalId = setInterval(() => setFrame((f) => (f + 1) % CARD_FRAMES), 3200);
      return () => clearInterval(intervalId);
    }, index * 700);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <div className="group relative aspect-square w-[72vw] shrink-0 overflow-hidden bg-black sm:w-[44vw] lg:w-[33vw]">
      {project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          poster={project.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <>
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
        </>
      )}

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

export default function WebsPage() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <StackSection />
      <StatsSection />
      <PrinciplesSection />
      <ServicesSection />
      <ProcessSection />
      <GallerySection />
    </div>
  );
}
