const navItems = [
  { label: "Servicios", href: "/servicios" },
  { label: "Casos", href: "/casos" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050607]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="/" className="text-sm font-semibold uppercase tracking-[0.28em]">
          Hyperfocus
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="/contacto"
          className="hidden rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:border-[#4fd6ff]/60 hover:bg-[#4fd6ff]/10 md:inline-flex"
        >
          Hablemos
        </a>
      </div>
    </header>
  );
}