import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { NAV_ITEMS, type NavItem } from "../../data/site";

// ─── Dropdown panel ────────────────────────────────────────────────────────────
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
};

type DropdownItem = NavItem & Required<Pick<NavItem, 'section' | 'links' | 'card'>>;

function NavDropdown({
  item,
  onEnter,
  onLeave,
}: {
  item: DropdownItem;
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

// ─── Mobile menu ───────────────────────────────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Renderiza en document.body con un portal: el header tiene backdrop-filter,
  // que crea un containing block y rompería el `position: fixed` del overlay.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-2xl lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Cabecera del overlay: logo + cerrar */}
          <div className="flex h-[72px] shrink-0 items-center justify-between px-6">
            <a href="/" onClick={onClose} className="flex items-center gap-3 text-[16px] font-semibold uppercase tracking-[0.24em] text-white">
              <img src="/brand/logo_blanco_acento.svg" alt="Hyperfocus" width="145" height="150" className="h-7 w-auto" />
              Hyperfocus
            </a>
            <button
              onClick={onClose}
              aria-label="Cerrar menú"
              className="flex h-6 w-7 items-center justify-center text-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 pb-10 pt-4">
            <motion.a
              href="/contacto"
              onClick={onClose}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10"
            >
              Ponerse en contacto
              <span className="text-[11px] opacity-70">→</span>
            </motion.a>

            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-white/8 py-3"
              >
                {item.labelClickable === false ? (
                  <span className="block text-2xl font-light tracking-[-0.01em] text-white/85 select-none">
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="block text-2xl font-light tracking-[-0.01em] text-white"
                  >
                    {item.label}
                  </a>
                )}
                {item.hasDropdown !== false && item.links && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {item.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="text-[14px] text-white/45 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── Main nav ──────────────────────────────────────────────────────────────────
export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body y cierra al pasar a desktop
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

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
        background: scrolled || activeItem || mobileOpen ? "rgba(0,0,0,0.65)" : "transparent",
        backdropFilter: scrolled || activeItem || mobileOpen ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled || activeItem || mobileOpen ? "blur(20px)" : "none",
      }}
    >
      <div className="flex h-[72px] items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 text-[16px] font-semibold uppercase tracking-[0.24em] text-white"
        >
          <img src="/brand/logo_blanco_acento.svg" alt="Hyperfocus" width="145" height="150" className="h-7 w-auto" />
          Hyperfocus
        </a>

        {/* Nav items */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.label;
            const activeColor = isActive ? "rgba(255,255,255,1)" : "";
            return (
              <div
                key={item.label}
                className="relative flex h-[72px] items-center"
                onMouseEnter={() => item.hasDropdown !== false ? handleEnter(item.label) : undefined}
                onMouseLeave={() => item.hasDropdown !== false ? handleLeave() : undefined}
              >
                {item.labelClickable === false ? (
                  <span
                    className="flex items-center text-[13px] text-white/55 transition-colors duration-200 select-none"
                    style={{ color: activeColor, cursor: "default" }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center text-[13px] text-white/55 transition-colors duration-200 hover:text-white"
                    style={{ color: activeColor }}
                  >
                    {item.label}
                  </a>
                )}

                {item.hasDropdown !== false && (
                  <AnimatePresence>
                    {isActive && (
                      <NavDropdown
                        item={item as DropdownItem}
                        onEnter={() => handleEnter(item.label)}
                        onLeave={handleLeave}
                      />
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
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
        <button
          className="relative z-50 flex h-6 w-7 flex-col items-end justify-center gap-[5px] lg:hidden"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span
            className="h-px bg-white transition-all duration-300"
            style={{
              width: mobileOpen ? "1.5rem" : "1.5rem",
              transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="h-px w-4 bg-white/60 transition-all duration-300"
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            className="h-px bg-white/40 transition-all duration-300"
            style={{
              width: mobileOpen ? "1.5rem" : "1.25rem",
              background: mobileOpen ? "#fff" : undefined,
              transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
