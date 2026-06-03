import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const WORDS = ["Nunca", "es", "suficiente."];

const STAGGER = 0.13;
const WORD_DUR = 0.55;
const HOLD = 1.0;
const FADE_DUR = 0.75;

const ALL_IN = 0.35 + STAGGER * (WORDS.length - 1) + WORD_DUR;
const FADE_DELAY_MS = (ALL_IN + HOLD) * 1000;
const TOTAL_MS = FADE_DELAY_MS + FADE_DUR * 1000;

interface Props {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: Props) {
  const [fading, setFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), FADE_DELAY_MS);
    const t2 = setTimeout(() => onCompleteRef.current(), TOTAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DUR}s ease-in-out`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <h1 className="flex flex-wrap justify-center gap-x-[0.4em] px-6 text-center text-xl font-light leading-none tracking-[0.01em] text-white sm:text-2xl md:text-3xl">
        {WORDS.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: WORD_DUR,
              delay: 0.35 + i * STAGGER,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </h1>
    </div>
  );
}
