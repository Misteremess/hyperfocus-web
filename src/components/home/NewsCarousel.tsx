import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const NEWS = [
  {
    image: "/images/news/ia-change-employ.webp",
    eyebrow: "REFLEXIONES",
    headline: "Cómo la IA está redefiniendo los flujos de trabajo en las empresas",
    body: "Una mirada al futuro de la automatización inteligente para equipos pequeños y medianos.",
    href: "/reflexiones",
  },
  {
    image: "/images/news/agent-whatsapp.webp",
    eyebrow: "IDEAS",
    headline: "Agentes de WhatsApp: qué pueden (y qué no pueden) hacer hoy",
    body: "Lo que de verdad aporta un agente conversacional en captación y atención al cliente.",
    href: "/reflexiones",
  },
  {
    image: "/images/news/ia-employees.webp",
    eyebrow: "INSIGHTS",
    headline: "Por qué la mayoría de los chatbots fallan (y cómo evitarlo)",
    body: "Los errores más comunes al implementar IA conversacional y cómo prevenirlos.",
    href: "/reflexiones",
  },
  {
    image: "/images/news/ia-change-employ.webp",
    eyebrow: "DISEÑO",
    headline: "La web como producto: diseñar para convertir, no para impresionar",
    body: "Principios de diseño orientados a resultados reales en proyectos digitales.",
    href: "/reflexiones",
  },
];

const INTERVAL = 7000;

export default function NewsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % NEWS.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  const item = NEWS[current];

  return (
    <div className="flex h-[88px] justify-center overflow-hidden sm:h-[116px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.a
          key={current}
          href={item.href}
          className="flex h-full max-w-2xl flex-1 items-start gap-4 sm:gap-5"
          initial={{ y: 56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -56, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Thumbnail */}
          <div className="hidden h-20 w-[88px] shrink-0 overflow-hidden rounded-xl bg-white/8 sm:block">
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1 pt-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35 sm:text-[11px]">
              {item.eyebrow}
            </span>
            <p className="line-clamp-2 max-w-[520px] text-[13px] font-medium leading-snug text-white/60 sm:text-sm">
              {item.headline}
            </p>
            <p className="line-clamp-2 max-w-[520px] text-[13px] leading-snug text-white sm:text-sm">
              {item.body}
            </p>
          </div>
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
