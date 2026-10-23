// ─── Configuración y datos compartidos del sitio ───────────────────────────
// Centraliza lo que aparece en varios sitios (nav, footer, enlaces legales,
// redes, contacto) para no duplicarlo entre componentes.

export const SITE = {
  name: "Hyperfocus",
  email: "info@hyperfocus.es",
  instagram: "https://www.instagram.com/hyperfocus.digital/",
  // Página de empresa en LinkedIn: vacío = no se muestra el icono.
  linkedin: "",
  // Teléfonos de contacto (los dos atienden llamadas y WhatsApp).
  phone: "+34 626 05 02 58",
  phoneHref: "tel:+34626050258",
  whatsapp: "https://wa.me/34626050258",
  phone2: "+34 617 64 47 86",
  phone2Href: "tel:+34617644786",
  whatsapp2: "https://wa.me/34617644786",
  // Enlace para reservar llamada (calendario de Odoo o Calendly). Vacío = no se muestra.
  booking: "",
  city: "Toledo",
  region: "Castilla-La Mancha",
  url: "https://hyperfocus.es",
} as const;

// ─── Equipo ─────────────────────────────────────────────────────────────────
// photo: ruta en /public sin extensión (se sirven .webp y -800.webp). Vacío = iniciales.
// linkedin: perfil personal. Vacío = no se muestra el enlace.
export const FOUNDERS = [
  {
    name: "Ignacio Sánchez",
    short: "Nacho",
    role: "Cofundador · CTO",
    focus: "Arquitectura, desarrollo y agentes de IA. Programa los proyectos de principio a fin.",
    photo: "/images/equipo/ignacio-trabajando",
    linkedin: "https://www.linkedin.com/in/ignacio-s%C3%A1nchez-yuste-646661384",
  },
  {
    name: "Máximo Du Perez",
    short: "Máximo",
    role: "Cofundador · CMO",
    focus: "Producto, negocio y relación con clientes. Traduce lo que necesitas a lo que hay que construir.",
    photo: "/images/equipo/maximo-trabajando",
    linkedin: "https://www.linkedin.com/in/maximoduperez/",
  },
] as const;

// Fotos reales del equipo (Sobre nosotros y portada). Sin extensión: .webp y -800.webp.
export const TEAM_PHOTOS = [
  { src: "/images/equipo/ambos-trabajando", alt: "Ignacio y Máximo revisando código juntos en la oficina" },
  { src: "/images/equipo/reunion-1", alt: "Reunión con un cliente revisando un panel de datos en pantalla" },
  { src: "/images/equipo/ignacio-trabajando", alt: "Ignacio Sánchez programando en su portátil" },
  { src: "/images/equipo/maximo-trabajando", alt: "Máximo Du Perez trabajando en la oficina" },
  { src: "/images/equipo/reunion-2", alt: "Ignacio y Máximo explicando una propuesta en una reunión" },
] as const;

// ─── Clientes (con permiso para nombrarlos) ─────────────────────────────────
export const CLIENTS = [
  {
    name: "Gatalogistic",
    url: "https://gatalogistic.com",
    logo: "/images/clientes/gatalogistic.webp",
    city: "Toledo",
    sector: "Transporte y logística",
    summary:
      "Empezó usando Elevate para encontrar licitaciones de transporte. Hoy analizamos con su equipo los procesos de administración para automatizar lo que se repite cada día.",
    caseUrl: "/reflexiones/caso-gatalogistic/",
  },
] as const;

// ─── Elevate (producto propio) ──────────────────────────────────────────────
export const ELEVATE = {
  url: "https://elevate.hyperfocus.es",
  // Planes publicados (precios con IVA). El plan Agency se consulta.
  plans: [
    {
      name: "Free",
      price: "0 €",
      period: "",
      desc: "Para probar la plataforma",
      items: ["1 perfil de búsqueda", "Alertas diarias por email", "Buscador completo"],
      cta: "Empezar gratis",
      highlight: false,
    },
    {
      name: "Pro",
      price: "35 €",
      period: "/mes, IVA incluido",
      desc: "Para empresas que licitan a menudo",
      items: ["5 perfiles de búsqueda", "Alertas inmediatas", "Asistente Noa con IA", "Exportación a CSV y PDF"],
      cta: "Empezar con Pro",
      highlight: true,
    },
    {
      name: "Agency",
      price: "Consultar",
      period: "",
      desc: "Para consultoras y despachos",
      items: ["Perfiles ilimitados", "Todo lo de Pro", "Gestión de varios clientes", "Soporte prioritario"],
      cta: "Ver en Elevate",
      highlight: false,
    },
  ],
  // Capturas reales de la app (WebP en /public/images/elevate/, versión -800 para móvil).
  // Originales en PNG en /assets-src/elevate/.
  screenshots: {
    dashboard: {
      src: "/images/elevate/dashboard",
      alt: "Panel de inicio de Elevate con el valor en juego, licitaciones que cierran esta semana, alertas nuevas y gráfico de actividad",
    },
    buscador: {
      src: "/images/elevate/buscador",
      alt: "Buscador de licitaciones de Elevate con filtros por estado, fecha, comunidad autónoma, importe y categoría",
    },
    alertas: {
      src: "/images/elevate/panel-de-alertas",
      alt: "Panel de alertas de Elevate con la configuración del resumen diario por email y los perfiles de búsqueda activos",
    },
    ficha: {
      src: "/images/elevate/licitacion-individual",
      alt: "Ficha de una licitación en Elevate con cronograma, información general, fechas, importes, códigos CPV y mapa del órgano de contratación",
    },
    noa: {
      src: "/images/elevate/noa-asistente-ia",
      alt: "Conversación con Noa, el asistente de IA de Elevate, respondiendo sobre licitaciones de software en plazo",
    },
  },
  // Cifra mostrada en el buscador (captura del 23-oct-2026). Revisar de vez en cuando.
  tendersIndexed: "70.000",
} as const;

// ─── Titular del sitio (aviso legal y privacidad) ──────────────────────────
// Datos exigidos por el art. 10 LSSI. Se usan en /aviso-legal y /privacidad.
export const LEGAL = {
  owner: "[TU NOMBRE Y APELLIDOS]",
  taxId: "[TU NIF O DNI]",
  address: "[TU DIRECCIÓN COMPLETA], España",
  lastUpdated: "Octubre 2026",
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
  { label: "Elevate", href: "/elevate", align: "center", hasDropdown: false },
  // Soluciones y Trabajo están ocultas hasta que tengan contenido
  // real (las páginas siguen existiendo como "en construcción" y quedan
  // excluidas del sitemap en astro.config.mjs).
  { label: "Sobre nosotros", href: "/sobre-nosotros", align: "right", hasDropdown: false },
  { label: "Reflexiones", href: "/reflexiones/", align: "right", hasDropdown: false },
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
    title: "Empresa",
    links: [
      { label: "Elevate", href: "/elevate" },
      { label: "Sobre nosotros", href: "/sobre-nosotros" },
      { label: "Reflexiones", href: "/reflexiones/" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

export const LEGAL_LINKS = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/cookies", label: "Cookies" },
];
