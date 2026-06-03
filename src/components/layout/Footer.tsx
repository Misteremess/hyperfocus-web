const COLUMNS = [
  {
    title: "Compañía",
    links: [
      { label: "Trabajar", href: "/trabajo" },
      { label: "Sobre nosotros", href: "/sobre-nosotros" },
      { label: "Lo que hacemos", href: "/servicios" },
      { label: "Perspectivas", href: "/reflexiones" },
      { label: "Centros tecnológicos", href: "/centros" },
    ],
  },
  {
    title: "Empleos",
    links: [
      { label: "Servicios", href: "/servicios" },
      { label: "Diseño", href: "/servicios/diseno" },
      { label: "Ingeniería", href: "/servicios/ingenieria" },
      { label: "Producto", href: "/servicios/producto" },
    ],
  },
  {
    title: "Soluciones",
    links: [
      { label: "Aplicaciones web", href: "/soluciones/web" },
      { label: "Aplicaciones móviles", href: "/soluciones/mobile" },
      { label: "Sitios web", href: "/soluciones/websites" },
    ],
  },
];

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/78" />

      <div className="relative z-10 px-6 lg:px-8">
        {/* Main section: logo + slogan left, columns right */}
        <div className="flex items-start justify-between gap-16 py-20 lg:py-28">
          {/* Left: logo + slogan */}
          <div className="flex flex-col gap-8 max-w-lg">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white lg:text-5xl xl:text-6xl">
              Construimos sistemas que hacen crecer empresas.
            </h2>
            <a href="/">
              <img src="/logo_blanco_acento.svg" alt="Hyperfocus" className="h-12 w-auto" />
            </a>
          </div>

          {/* Right: 3 columns */}
          <div className="flex shrink-0 gap-10 lg:gap-16 text-right pt-1">
            {COLUMNS.map((col) => (
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
        <div className="border-t border-white/10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-5 text-xs text-white/30">
            <p>© {new Date().getFullYear()} Hyperfocus. Todos los derechos reservados.</p>
            <a href="/privacidad" className="transition hover:text-white">Privacidad</a>
            <a href="/aviso-legal" className="transition hover:text-white">Aviso legal</a>
            <a href="/cookies" className="transition hover:text-white">Cookies</a>
          </div>
          <div className="flex gap-5">
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-white/35 transition hover:text-white"
            >
              <IconLinkedIn />
            </a>
            <a
              href="#"
              aria-label="X"
              className="text-white/35 transition hover:text-white"
            >
              <IconX />
            </a>
            <a
              href="#"
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
