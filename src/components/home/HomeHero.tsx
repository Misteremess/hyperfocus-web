import { motion } from "motion/react";
import NewsCarousel from "./NewsCarousel";

function StudioBlock() {
  return (
    <div className="hidden max-w-[300px] flex-col items-end gap-5 text-right lg:flex">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/30">
        Estudio nuevo · 2026
      </p>
      <p className="text-[15px] leading-[1.7] text-white/55">
        Acabamos de empezar, pero no improvisamos. Cada proyecto que aceptamos
        recibe el mismo cuidado que esperarías de un equipo técnico interno.
      </p>
      <a
        href="/sobre-nosotros"
        className="whitespace-nowrap rounded-full border border-white/25 px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10"
      >
        Conócenos →
      </a>
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="relative flex h-screen flex-col overflow-hidden">
      {/* Video background */}
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

      {/* Subtle left overlay so white text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Main content row */}
      <div className="relative z-10 flex flex-1 items-center justify-between gap-12 px-6 lg:px-8 pt-[72px]">
          {/* Left: slogan + subtitle */}
          <div className="max-w-full lg:max-w-[55%]">
            <motion.h1
              className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-6xl lg:text-[5.5rem]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Diseñamos sistemas digitales para empresas que quieren avanzar.
            </motion.h1>

            <motion.p
              className="mt-7 max-w-[440px] text-base leading-[1.7] text-white/55"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Desde 2026, construimos software, agentes IA y automatizaciones
              para empresas que quieren mover ficha — desde quien arranca hasta
              quien busca dar el salto. Creatividad humana y tecnología, sin atajos.
            </motion.p>
          </div>

          {/* Right: companies list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <StudioBlock />
          </motion.div>
      </div>

      {/* News carousel — bottom of viewport */}
      <div className="relative z-10 px-6 lg:px-8 py-5">
        <NewsCarousel />
      </div>
    </section>
  );
}
