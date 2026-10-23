// @refresh reset
import { useState, useLayoutEffect } from "react";
import { MotionConfig, motion } from "motion/react";
import IntroSplash, { INTRO_SEEN_KEY } from "./IntroSplash";
import HomeNav from "./HomeNav";
import HomeHero from "./HomeHero";
import {
  ProblemsSection,
  ElevateTeaser,
  ClientsSection,
  HowWeWorkSection,
  WhoWeAreSection,
  ContactCtaSection,
} from "./HomeSections";

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  // La intro se muestra una vez por sesión. El script inline del layout marca
  // <html data-intro-seen> antes de pintar, así que no llega a verse.
  const [skipped, setSkipped] = useState(false);

  useLayoutEffect(() => {
    let seen = document.documentElement.dataset.introSeen === "1";
    try {
      seen = seen || sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {}
    if (seen) {
      setSkipped(true);
      setSplashDone(true);
    }
  }, []);

  const handleSplashDone = () => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
    setSplashDone(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-paper text-ink">
        {!splashDone && <IntroSplash onComplete={handleSplashDone} />}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: splashDone ? 1 : 0 }}
          transition={{ duration: skipped ? 0 : 0.7, ease: "easeInOut" }}
        >
          <HomeNav />
          <main>
            <HomeHero />
            <ProblemsSection />
            <ElevateTeaser />
            <ClientsSection />
            <HowWeWorkSection />
            <WhoWeAreSection />
            <ContactCtaSection />
          </main>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
