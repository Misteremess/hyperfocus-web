// @refresh reset
import { useState } from "react";
import { motion } from "motion/react";
import IntroSplash from "./IntroSplash";
import HomeNav from "./HomeNav";
import HomeHero from "./HomeHero";

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {!splashDone && <IntroSplash onComplete={() => setSplashDone(true)} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <HomeNav />
        <HomeHero />
      </motion.div>
    </div>
  );
}
