import { useState } from "react";
import { motion } from "motion/react";
import NewsCarousel from "./NewsCarousel";

const COMPANIES = [
  { name: "Vodafone", href: "/trabajo" },
  { name: "Mapfre", href: "/trabajo" },
  { name: "Santander", href: "/trabajo" },
  { name: "Inditex", href: "/trabajo" },
  { name: "Telefónica", href: "/trabajo" },
  { name: "Repsol", href: "/trabajo" },
];

function CompaniesBlock() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative hidden flex-col items-end lg:flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {COMPANIES.map((company) => (
        <a
          key={company.name}
          href="/trabajo"
          className="block py-2 text-right text-2xl font-light text-white"
          style={{
            opacity: hovered ? 0.35 : 0.65,
            filter: hovered ? "blur(3px)" : "blur(0px)",
            transition: "opacity 0.3s ease, filter 0.3s ease",
          }}
        >
          {company.name}
        </a>
      ))}

      {/* Button centered over the blurred names */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <a
          href="/trabajo"
          className="pointer-events-auto rounded-full border border-white/25 px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10"
          style={{
            transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)",
            transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          Ver todo el trabajo →
        </a>
      </div>
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
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
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
          <div className="max-w-[55%]">
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
              Desde 2020, construimos software, agentes IA y automatizaciones
              para líderes del sector y nuevos disruptores. Fusionamos
              creatividad humana con tecnología para superar límites.
            </motion.p>
          </div>

          {/* Right: companies list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <CompaniesBlock />
          </motion.div>
      </div>

      {/* News carousel — bottom of viewport */}
      <div className="relative z-10 px-6 lg:px-8 py-5">
        <NewsCarousel />
      </div>
    </section>
  );
}
