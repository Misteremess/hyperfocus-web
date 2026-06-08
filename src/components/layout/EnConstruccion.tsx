import { motion } from "motion/react";
import HomeNav from "../home/HomeNav";
import Footer from "./Footer";

interface Props {
  tag: string;
  title: string;
  subtitle?: string;
}

export default function EnConstruccion({ tag, title, subtitle }: Props) {
  return (
    <>
      <HomeNav />
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#040506] px-6 pb-24 pt-28 text-center">
        <motion.p
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {tag}
        </motion.p>

        <motion.h1
          className="max-w-2xl text-3xl font-semibold leading-[1.15] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="mt-5 max-w-md text-[14px] leading-[1.75] text-white/40"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.a
          href="/"
          className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-[14px] font-medium text-white transition-all duration-200 hover:border-white/55 hover:bg-white/10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          Volver al inicio
          <span className="text-[11px] opacity-60">→</span>
        </motion.a>
      </main>
      <Footer />
    </>
  );
}
