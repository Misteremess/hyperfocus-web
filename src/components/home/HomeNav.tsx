import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Nav data ──────────────────────────────────────────────────────────────────
type Align = "left" | "center" | "right";

interface NavItem {
  label: string;
  href: string;
  align: Align;
  section: string;
  links: { label: string; href: string }[];
  card: { title: string; description: string; href: string };
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Servicios",
    href: "/servicios",
    align: "left",
    section: "Nuestros Servicios",
    links: [
      { label: "Software a medida", href: "/servicios/software" },
      { label: "Agentes de IA", href: "/servicios/agentes-ia" },
      { label: "Automatización", href: "/servicios/automatizacion" },
      { label: "Webs y aplicaciones", href: "/servicios/webs" },
    ],
    card: {
      title: "Lo que hacemos",
      description: "Más de 4 años construyendo sistemas digitales a medida para empresas.",
      href: "/servicios",
    },
  },
  {
    label: "Soluciones",
    href: "/soluciones",
    align: "left",
    section: "Por tipo de empresa",
    links: [
      { label: "Startups", href: "/soluciones/startups" },
      { label: "Medianas empresas", href: "/soluciones/empresas" },
      { label: "E-commerce", href: "/soluciones/ecommerce" },
      { label: "Servicios profesionales", href: "/soluciones/servicios" },
    ],
    card: {
      title: "Tu solución",
      description: "Adaptamos cada sistema al contexto y objetivos de tu empresa.",
      href: "/soluciones",
    },
  },
  {
    label: "Trabajo",
    href: "/trabajo",
    align: "center",
    section: "Casos de éxito",
    links: [
      { label: "Ver todos los proyectos", href: "/trabajo" },
      { label: "Sector tecnológico", href: "/trabajo?sector=tech" },
      { label: "Sector retail", href: "/trabajo?sector=retail" },
      { label: "Servicios profesionales", href: "/trabajo?sector=servicios" },
    ],
    card: {
      title: "Proyectos reales",
      description: "Resultados medibles en múltiples sectores e industrias.",
      href: "/trabajo",
    },
  },
  {
    label: "Sobre nosotros",
    href: "/sobre-nosotros",
    align: "right",
    section: "El equipo",
    links: [
      { label: "Quiénes somos", href: "/sobre-nosotros" },
      { label: "Nuestro equipo", href: "/sobre-nosotros#equipo" },
      { label: "Nuestra historia", href: "/sobre-nosotros#historia" },
      { label: "Trabaja con nosotros", href: "/sobre-nosotros#careers" },
    ],
    card: {
      title: "El equipo",
      description: "Pequeño y especializado, obsesionado con hacer las cosas bien.",
      href: "/sobre-nosotros",
    },
  },
  {
    label: "Reflexiones",
    href: "/reflexiones",
    align: "right",
    section: "Insights",
    links: [
      { label: "Últimos artículos", href: "/reflexiones" },
      { label: "IA y automatización", href: "/reflexiones?tag=ia" },
      { label: "Diseño y producto", href: "/reflexiones?tag=diseno" },
      { label: "Estrategia digital", href: "/reflexiones?tag=estrategia" },
    ],
    card: {
      title: "Reflexiones",
      description: "Ideas sobre tecnología, diseño y sistemas que transforman negocios.",
      href: "/reflexiones",
    },
  },
];

// ─── Dropdown panel ────────────────────────────────────────────────────────────
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
};

function NavDropdown({
  item,
  onEnter,
  onLeave,
}: {
  item: NavItem;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const alignClass =
    item.align === "left"
      ? "left-0"
      : item.align === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <motion.div
      className={`absolute top-full z-50 w-[540px] overflow-hidden rounded-2xl border border-white/15 bg-black/90 shadow-2xl backdrop-blur-2xl ${alignClass}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="flex gap-5 p-6">
        {/* Left: section label + links */}
        <div className="flex-1">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            {item.section}
          </p>
          <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-0.5">
            {item.links.map((link) => (
              <motion.li key={link.href} variants={itemVariants}>
                <a
                  href={link.href}
                  className="group flex items-center rounded-lg px-2 py-2.5 text-[14px] text-white/55 transition-colors duration-150 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Right: clickable card */}
        <motion.a
          href={item.card.href}
          className="group relative flex w-[180px] shrink-0 flex-col justify-end overflow-hidden rounded-xl bg-white/5 p-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative gradient bg */}
          <div
            className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-90"
            style={{
              background:
                "radial-gradient(circle at 70% 30%, rgba(79,214,255,0.15), transparent 60%), radial-gradient(circle at 20% 80%, rgba(120,80,255,0.1), transparent 50%)",
            }}
          />
          <div className="absolute inset-0 border border-white/8 rounded-xl" />

          <div className="relative z-10 mt-auto">
            <p className="text-[13px] font-semibold text-white">{item.card.title}</p>
            <p className="mt-1 text-[11px] leading-[1.5] text-white/45">
              {item.card.description}
            </p>
            <div className="mt-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[11px] text-white/50 transition-all duration-200 group-hover:border-white/60 group-hover:text-white">
              →
            </div>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
}

// ─── Main nav ──────────────────────────────────────────────────────────────────
export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveItem(label);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setActiveItem(null), 120);
  };

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full transition-all duration-500"
      style={{
        background: scrolled || activeItem ? "rgba(0,0,0,0.65)" : "transparent",
        backdropFilter: scrolled || activeItem ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled || activeItem ? "blur(20px)" : "none",
      }}
    >
      <div className="flex h-[72px] items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 text-[16px] font-semibold uppercase tracking-[0.24em] text-white"
        >
          <img src="/logo_blanco_acento.svg" alt="Hyperfocus" className="h-7 w-auto" />
          Hyperfocus
        </a>

        {/* Nav items */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative flex h-[72px] items-center"
              onMouseEnter={() => handleEnter(item.label)}
              onMouseLeave={handleLeave}
            >
              <a
                href={item.href}
                className="flex items-center text-[13px] text-white/55 transition-colors duration-200 hover:text-white"
                style={{ color: activeItem === item.label ? "rgba(255,255,255,1)" : "" }}
              >
                {item.label}
              </a>

              <AnimatePresence>
                {activeItem === item.label && (
                  <NavDropdown
                    item={item}
                    onEnter={() => handleEnter(item.label)}
                    onLeave={handleLeave}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="/contacto"
          className="hidden items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-[15px] font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10 lg:inline-flex"
        >
          Ponerse en contacto
          <span className="text-[11px] opacity-70">→</span>
        </a>

        {/* Mobile hamburger */}
        <button className="flex flex-col gap-[5px] lg:hidden" aria-label="Menú">
          <span className="h-px w-6 bg-white" />
          <span className="h-px w-4 bg-white/60" />
          <span className="h-px w-5 bg-white/40" />
        </button>
      </div>
    </header>
  );
}
