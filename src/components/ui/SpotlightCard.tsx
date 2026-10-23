import { useRef } from "react";

/** Tarjeta-enlace con un foco de luz que sigue al cursor (solo con ratón). */
export default function SpotlightCard({
  href,
  color = "255,255,255",
  children,
}: {
  href: string;
  color?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-ink/25"
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--x, 50%) var(--y, 0%), rgba(${color},0.14), transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex h-full flex-col">{children}</span>
    </a>
  );
}
