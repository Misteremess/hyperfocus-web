// @refresh reset
import { motion } from 'motion/react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    number: '01',
    title: 'Obsesión por la calidad',
    desc: 'No entregamos código que funciona. Entregamos sistemas en los que confiarías tu negocio. Cada línea, cada decisión de arquitectura, cada interacción pasa por ese filtro.',
  },
  {
    number: '02',
    title: 'Transparencia radical',
    desc: 'Sin jerga técnica innecesaria, sin estimaciones infladas ni sorpresas en el camino. Comunicación directa, expectativas reales y honestidad ante todo.',
  },
  {
    number: '03',
    title: 'Impacto medible',
    desc: 'No construimos proyectos, construimos resultados. Cada decisión de producto se ancla en métricas de negocio — conversión, retención, eficiencia, coste.',
  },
  {
    number: '04',
    title: 'Equipo pequeño, responsabilidad total',
    desc: 'Los mismos expertos que diseñan son los que construyen. Sin capas de gestión, sin subcontratas. Acceso directo a quien toma las decisiones técnicas.',
  },
];

const MILESTONES = [
  { year: '2026', title: 'Nace Hyperfocus', desc: 'Arrancamos con una idea simple: construir software, IA y automatizaciones con el cuidado de un equipo interno, sin las capas ni la distancia de una agencia.' },
  { year: 'Hoy', title: 'Primeros proyectos', desc: 'Estamos tomando nuestros primeros clientes y montando demos reales. Pocos proyectos a la vez, toda la atención puesta en cada uno.' },
  { year: 'Próximo', title: 'Lo que viene', desc: 'Casos de éxito documentados, una práctica de agentes de IA más profunda y un equipo que crece solo cuando suma — nunca por inercia.' },
];

const TEAM = [
  { role: 'Founder & CEO', focus: 'Producto y estrategia de negocio', gradient: 'from-violet-700/40 to-indigo-950', accent: 'rgba(139,92,246,0.15)' },
  { role: 'CTO', focus: 'Arquitectura y stack técnico', gradient: 'from-sky-600/35 to-slate-950', accent: 'rgba(14,165,233,0.15)' },
  { role: 'Lead Designer', focus: 'UX, sistemas de diseño e interfaces', gradient: 'from-rose-600/30 to-purple-950', accent: 'rgba(244,63,94,0.12)' },
  { role: 'AI Engineer', focus: 'Agentes, modelos y automatización', gradient: 'from-teal-600/30 to-slate-950', accent: 'rgba(20,184,166,0.15)' },
];

const CAROUSEL_PHOTOS = [
  { h: 'h-52', gradient: 'from-violet-900/60 to-indigo-950' },
  { h: 'h-40', gradient: 'from-slate-800/80 to-slate-950' },
  { h: 'h-64', gradient: 'from-sky-900/50 to-slate-950' },
  { h: 'h-44', gradient: 'from-rose-900/40 to-purple-950' },
  { h: 'h-56', gradient: 'from-teal-900/50 to-slate-950' },
  { h: 'h-36', gradient: 'from-amber-900/40 to-slate-950' },
  { h: 'h-60', gradient: 'from-indigo-900/60 to-slate-950' },
  { h: 'h-48', gradient: 'from-emerald-900/40 to-slate-950' },
];

// ─── Photo carousel ───────────────────────────────────────────────────────────

function PhotoCarousel() {
  const doubled = [...CAROUSEL_PHOTOS, ...CAROUSEL_PHOTOS];
  return (
    <div className="overflow-hidden">
      <div
        className="flex items-end gap-3"
        style={{ animation: 'hf-marquee 40s linear infinite' }}
      >
        {doubled.map((photo, i) => (
          <div
            key={i}
            className={`${photo.h} w-[180px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-b ${photo.gradient} sm:w-[220px]`}
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 28%, rgba(79,214,255,0.06) 0%, transparent 52%)',
        }}
      />

      {/* Text — fills space, pinned to bottom */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-8 pt-[96px] lg:px-8 lg:pb-10">
        <motion.p
          className="mb-5 text-right text-[10px] font-semibold uppercase tracking-[0.26em] text-white/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Sobre nosotros
        </motion.p>

        <motion.h1
          className="text-right text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.5rem] lg:leading-[1.02] xl:text-[5rem]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          Somos el equipo técnico que muchas empresas desearían tener dentro.
        </motion.h1>

        <motion.p
          className="mt-6 text-right text-[14px] leading-[1.75] text-white/38 lg:text-[15px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          Pequeño y especializado. Sin agencias intermediarias,
          <br className="hidden lg:block" />
          sin distancia entre quien decide y quien ejecuta.
        </motion.p>
      </div>

      {/* Photo carousel — borde inferior */}
      <div className="relative z-10">
        <PhotoCarousel />
      </div>
    </section>
  );
}

// ─── Section 2: Values ────────────────────────────────────────────────────────

function ValuesSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8">
      <div className="mb-12 sm:mb-16">
        <motion.p
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/25"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px 120px 0px' }}
        >
          Lo que nos define
        </motion.p>
        <motion.h2
          className="text-[1.75rem] font-semibold tracking-[-0.035em] text-white sm:text-3xl lg:text-[2.75rem] leading-[1.1]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px 120px 0px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Cuatro principios que no negociamos.
        </motion.h2>
      </div>

      <div className="grid gap-px bg-white/8 sm:grid-cols-2">
        {VALUES.map((value, i) => (
          <motion.div
            key={value.number}
            className="bg-black p-8 sm:p-10 lg:p-12"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 text-[11px] font-semibold text-white/18">{value.number}</p>
            <h3 className="mb-4 text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-white lg:text-[22px]">
              {value.title}
            </h3>
            <p className="text-[14px] leading-[1.75] text-white/38">{value.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 3: Story ─────────────────────────────────────────────────────────

function StorySection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8" id="historia">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="w-full shrink-0 lg:w-[28%]">
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/25"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
          >
            Nuestra historia
          </motion.p>
          <motion.h2
            className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Empezamos en 2026. Sin atajos.
          </motion.h2>
          <motion.p
            className="mt-5 text-[14px] leading-[1.75] text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Una empresa joven, con estándares que no son de empresa joven.
          </motion.p>
        </div>

        <div className="flex-1">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.year}
              className={`flex gap-8 py-7 ${i < MILESTONES.length - 1 ? 'border-b border-white/8' : ''}`}
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px 120px 0px' }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="w-12 shrink-0 text-[13px] font-semibold tabular-nums text-white/22 sm:w-14">
                {m.year}
              </p>
              <div>
                <p className="text-[14px] font-semibold text-white/85">{m.title}</p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-white/38">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Team ──────────────────────────────────────────────────────────

function TeamSection() {
  return (
    <section className="border-t border-white/8 py-16 px-6 sm:py-24 lg:px-8" id="equipo">
      <div className="mb-12 sm:mb-16">
        <motion.p
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/25"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px 120px 0px' }}
        >
          El equipo
        </motion.p>
        <motion.h2
          className="text-[1.75rem] font-semibold tracking-[-0.035em] text-white sm:text-3xl lg:text-[2.75rem] leading-[1.1]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px 120px 0px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Pequeño por diseño, no por presupuesto.
        </motion.h2>
        <motion.p
          className="mt-4 max-w-xl text-[14px] text-white/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px 120px 0px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Creemos que la calidad se diluye con el tamaño. Cada persona del equipo
          es experta en su área y trabaja directamente con los clientes.
        </motion.p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.role}
            className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b ${member.gradient}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 30%, ${member.accent}, transparent 60%)` }}
            />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-20">
              <div className="h-16 w-16 rounded-full border border-white/40" />
              <div className="absolute top-3 left-3 h-10 w-10 rounded-full border border-white/25" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">
              <p className="text-[15px] font-semibold text-white">{member.role}</p>
              <p className="mt-1 text-[12px] text-white/40">{member.focus}</p>
            </div>
            <div className="absolute inset-0 border border-white/0 rounded-2xl transition-all duration-300 group-hover:border-white/10" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 5: CTA ──────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="border-t border-white/8 py-20 px-6 sm:py-28 lg:px-8" id="careers">
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] px-8 py-16 sm:px-12 sm:py-20 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(79,214,255,0.10) 0%, transparent 60%)' }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(79,214,255,0.04) 50%, transparent 65%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <motion.p
            className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
          >
            ¿Trabajamos juntos?
          </motion.p>

          <motion.h2
            className="max-w-2xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-3xl lg:text-[2.5rem]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Si tienes un problema técnico real, nosotros tenemos las herramientas para resolverlo.
          </motion.h2>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px 120px 0px' }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            <a
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:border-white/55 hover:bg-white/12"
            >
              Hablar con el equipo
              <span className="text-[11px] opacity-60">→</span>
            </a>
            <a
              href="mailto:info@hyperfocus.es"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-3 text-[14px] text-white/45 transition-all duration-200 hover:border-white/25 hover:text-white"
            >
              info@hyperfocus.es
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SobreNosotrosPage() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <ValuesSection />
      <StorySection />
      <TeamSection />
      <CtaSection />
    </div>
  );
}
