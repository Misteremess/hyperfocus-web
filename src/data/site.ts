// ─── Configuración y datos compartidos del sitio ───────────────────────────
// Centraliza lo que aparece en varios sitios (nav, footer, enlaces legales,
// redes, contacto) para no duplicarlo entre componentes.

export const SITE = {
  name: "Hyperfocus",
  email: "info@hyperfocus.es",
  instagram: "https://www.instagram.com/hyperfocus.digital/",
} as const;

// ─── Navegación principal ───────────────────────────────────────────────────
export type Align = "left" | "center" | "right";

export interface NavItem {
  label: string;
  href: string;
  align: Align;
  hasDropdown?: boolean;
  labelClickable?: boolean; // false = solo muestra el dropdown, sin navegar
  section?: string;
  links?: { label: string; href: string }[];
  card?: { title: string; description: string; href: string };
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Servicios",
    href: "/servicios",
    align: "left",
    hasDropdown: true,
    labelClickable: false,
    section: "Nuestros Servicios",
    links: [
      { label: "Software a medida", href: "/servicios/software" },
      { label: "Agentes de IA", href: "/servicios/agentes-ia" },
      { label: "Automatización", href: "/servicios/automatizacion" },
      { label: "Webs y aplicaciones", href: "/servicios/webs" },
    ],
    card: {
      title: "Lo que hacemos",
      description: "Software, IA y automatización a medida, con estándares de equipo interno.",
      href: "/servicios",
    },
  },
  {
    label: "Soluciones",
    href: "/soluciones",
    align: "left",
    hasDropdown: true,
    labelClickable: false,
    section: "Por tipo de empresa",
    links: [
      { label: "Startups", href: "/soluciones/startups" },
      { label: "Medianas empresas", href: "/soluciones/empresas" },
      { label: "E-commerce", href: "/soluciones/ecommerce" },
      { label: "Servicios profesionales", href: "/soluciones/servicios" },
    ],
    card: {
      title: "Tu solución",
      description: "Adaptamos cada sistema al contexto y objetivos de tu empresa.",
      href: "/soluciones",
    },
  },
  { label: "Trabajo", href: "/trabajo", align: "center", hasDropdown: false },
  { label: "Sobre nosotros", href: "/sobre-nosotros", align: "right", hasDropdown: false },
  { label: "Reflexiones", href: "/reflexiones", align: "right", hasDropdown: false },
];

// ─── Footer ─────────────────────────────────────────────────────────────────
export const FOOTER_COLUMNS = [
  {
    title: "Servicios",
    links: [
      { label: "Software a medida", href: "/servicios/software" },
      { label: "Agentes de IA", href: "/servicios/agentes-ia" },
      { label: "Automatización", href: "/servicios/automatizacion" },
      { label: "Webs y aplicaciones", href: "/servicios/webs" },
    ],
  },
  {
    title: "Soluciones",
    links: [
      { label: "Startups", href: "/soluciones/startups" },
      { label: "Medianas empresas", href: "/soluciones/empresas" },
      { label: "E-commerce", href: "/soluciones/ecommerce" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nosotros", href: "/sobre-nosotros" },
      { label: "Reflexiones", href: "/reflexiones" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

export const LEGAL_LINKS = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/cookies", label: "Cookies" },
];
