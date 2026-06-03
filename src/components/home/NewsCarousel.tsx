import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const NEWS = [
  {
    image: "/news/craftmatters.jpg",
    eyebrow: "REFLEXIONES — MAYO 2026",
    headline: "Cómo la IA está redefiniendo los flujos de trabajo empresarial en 2026",
    body: "Una mirada profunda al futuro de la automatización inteligente para empresas medianas.",
    href: "/reflexiones",
  },
  {
    image: "/news/caso-retail.jpg",
    eyebrow: "CASOS — ABRIL 2026",
    headline: "De 0 a 10.000 clientes en 4 meses con un agente de WhatsApp",
    body: "Cómo automatizamos la captación de leads para un cliente del sector retail.",
    href: "/trabajo",
  },
  {
    image: "/news/chatbots.jpg",
    eyebrow: "INSIGHTS — MARZO 2026",
    headline: "Por qué la mayoría de los chatbots fallan (y cómo evitarlo)",
    body: "Los errores más comunes al implementar IA conversacional y cómo prevenirlos.",
    href: "/reflexiones",
  },
  {
    image: "/news/producto.jpg",
    eyebrow: "DISEÑO — FEBRERO 2026",
    headline: "La web como producto: diseñar para convertir, no para impresionar",
    body: "Principios de diseño orientados a resultados reales para proyectos digitales.",
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
    <div className="flex justify-center overflow-hidden" style={{ height: "116px" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.a
          key={current}
          href={item.href}
          className="flex h-full max-w-2xl flex-1 items-start gap-5"
          initial={{ y: 56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -56, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Thumbnail */}
          <div className="h-20 w-[88px] shrink-0 overflow-hidden rounded-xl bg-white/8">
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
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              {item.eyebrow}
            </span>
            <p className="text-sm font-medium leading-snug text-white/60 max-w-[520px]">
              {item.headline}
            </p>
            <p className="text-sm leading-snug text-white max-w-[520px]">
              {item.body}
            </p>
          </div>
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
