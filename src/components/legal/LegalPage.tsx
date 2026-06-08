import HomeNav from "../home/HomeNav";
import Footer from "../layout/Footer";

interface Section {
  title: string;
  content: string | React.ReactNode;
}

interface LegalPageProps {
  tag: string;
  title: string;
  subtitle?: string;
  lastUpdated: string;
  sections: Section[];
  currentPath: string;
}

const legalLinks = [
  { href: "/aviso-legal", label: "Aviso Legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
];

export default function LegalPage({ tag, title, subtitle, lastUpdated, sections, currentPath }: LegalPageProps) {
  return (
    <>
      <HomeNav />
      <main className="min-h-screen bg-[#040506] pt-28 pb-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="flex gap-16">
            {/* Sidebar nav */}
            <aside className="hidden lg:block w-44 shrink-0">
              <div className="sticky top-32">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
                  Documentos
                </p>
                <nav className="flex flex-col gap-1">
                  {legalLinks.map(({ href, label }) => {
                    const isActive = currentPath === href;
                    return (
                      <a
                        key={href}
                        href={href}
                        className={`rounded-lg px-3 py-2 text-[13px] transition-colors ${
                          isActive
                            ? "bg-white/6 text-white"
                            : "text-white/35 hover:bg-white/4 hover:text-white/70"
                        }`}
                      >
                        {label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0 flex-1">
              {/* Header */}
              <div className="mb-14 border-b border-white/8 pb-10">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
                  {tag}
                </p>
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-4 text-[15px] leading-[1.75] text-white/40">{subtitle}</p>
                )}
                <p className="mt-6 text-[12px] text-white/20">
                  Última actualización: {lastUpdated}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-10">
                {sections.map((section, i) => (
                  <section key={i}>
                    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      {String(i + 1).padStart(2, "0")} — {section.title}
                    </h2>
                    {typeof section.content === "string" ? (
                      <div className="space-y-4">
                        {section.content.split("\n\n").map((para, j) => (
                          <p key={j} className="text-[14px] leading-[1.85] text-white/55">
                            {para}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[14px] leading-[1.85] text-white/55">
                        {section.content}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Contact strip */}
              <div className="mt-16 rounded-2xl border border-white/8 bg-white/3 px-8 py-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  ¿Dudas?
                </p>
                <p className="mt-2 text-[14px] text-white/55">
                  Si tienes cualquier pregunta sobre este documento, escríbenos a{" "}
                  <a
                    href="mailto:info@hyperfocus.es"
                    className="text-white/80 underline underline-offset-2 transition hover:text-white"
                  >
                    info@hyperfocus.es
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
