import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Aparición suave al entrar en pantalla (respeta reduced-motion vía MotionConfig). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 120px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Cabecera de sección: etiqueta pequeña + h2 + entradilla opcional. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`mb-10 sm:mb-14 ${className}`}>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/55">{eyebrow}</p>
      <h2 className="max-w-3xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.75rem]">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] text-ink/65">{intro}</p>}
    </Reveal>
  );
}

/** Botones de llamada a la acción. */
export function PrimaryButton({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition hover:bg-ink/90"
    >
      {children}
      <span aria-hidden="true" className="text-[11px]">
        →
      </span>
    </a>
  );
}

export function SecondaryButton({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/30 px-6 py-3 text-[14px] font-medium text-ink transition hover:border-ink/60 hover:bg-ink/10"
    >
      {children}
    </a>
  );
}
