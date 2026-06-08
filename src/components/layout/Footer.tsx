import { SITE, FOOTER_COLUMNS, LEGAL_LINKS } from "../../data/site";

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/posters/hero.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/78" />

      <div className="relative z-10 px-6 lg:px-8">
        {/* Main section: logo + slogan left, columns right */}
        <div className="flex flex-col gap-12 py-16 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:py-28">
          {/* Left: logo + slogan */}
          <div className="flex max-w-lg flex-col gap-8">
            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              Construimos sistemas que hacen crecer empresas.
            </h2>
            <a href="/">
              <img src="/brand/logo_blanco_acento.svg" alt="Hyperfocus" width="145" height="150" className="h-10 w-auto sm:h-12" />
            </a>
          </div>

          {/* Right: 3 columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex lg:shrink-0 lg:gap-16 lg:pt-1 lg:text-right">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-[13px] text-white/45 transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom strip: copyright + legal on left, social icons on right */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/30">
            <p>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</p>
            {LEGAL_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-white">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex gap-5">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/35 transition hover:text-white"
            >
              <IconInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
