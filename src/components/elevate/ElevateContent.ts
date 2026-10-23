// ─── Contenido de Elevate ───────────────────────────────────────────────────
// Textos tomados de la landing oficial (elevate.hyperfocus.es) y de las
// capturas reales de la app. Los precios no se repiten aquí a propósito: se
// enlaza a la landing para que haya una sola fuente de verdad.
import { ELEVATE } from "../../data/site";

export const ELEVATE_GREEN = "rgba(16,185,129,";

export const ELEVATE_STATS = [
  { value: `${ELEVATE.tendersIndexed}+`, label: "licitaciones en el buscador" },
  { value: "A diario", label: "datos de la Plataforma de Contratación del Sector Público" },
  { value: "0 €", label: "para empezar, sin tarjeta de crédito" },
  { value: "IA", label: "que puntúa el encaje y responde tus dudas" },
];

export const ELEVATE_STEPS = [
  {
    title: "Defines qué buscas",
    desc: "Describes tu negocio con tus palabras o eliges códigos CPV, palabras clave, zona e importe. Un perfil por cada sector que te interese.",
  },
  {
    title: "Elevate filtra y puntúa",
    desc: "Cada día revisa la Plataforma de Contratación del Sector Público y la IA puntúa cada licitación según lo bien que encaja con tu perfil. El ruido se queda fuera.",
  },
  {
    title: "Te avisamos",
    desc: "Recibes un email al momento o un resumen diario a la hora que elijas. Puedes pausar o desactivar los avisos cuando quieras.",
  },
];

// Secciones con captura: imagen + texto + puntos concretos.
export const ELEVATE_SHOWCASE = [
  {
    key: "dashboard" as const,
    eyebrow: "Panel de inicio",
    title: "Todo lo que importa hoy, en una pantalla.",
    desc: "Al entrar ves cuánto dinero hay en juego en las licitaciones que encajan contigo, cuáles cierran esta semana y las alertas que aún no has leído.",
    points: [
      "Valor total de las licitaciones en plazo de tus perfiles",
      "Las que cierran en los próximos días, ordenadas por urgencia",
      "Actividad de publicaciones y adjudicaciones de los últimos 30 o 90 días",
    ],
  },
  {
    key: "buscador" as const,
    eyebrow: "Buscador",
    title: "Busca en todo el sector público con filtros que tienen sentido.",
    desc: "Más de 70.000 licitaciones con filtros por estado, fecha, comunidad autónoma, localización, importe y categoría. Marca favoritas, descarta las que no te sirven y exporta a CSV o PDF.",
    points: [
      "Filtros por CPV, importe, procedimiento y estado",
      "Favoritos y descartes por perfil de búsqueda",
      "Exportación de la selección a CSV o PDF",
    ],
  },
  {
    key: "alertas" as const,
    eyebrow: "Alertas",
    title: "Te avisa solo de lo que encaja contigo.",
    desc: "Cada perfil de búsqueda genera sus propias alertas, marcadas por relevancia. Tú decides si las quieres al momento o en un resumen diario a la hora que prefieras.",
    points: [
      "Email inmediato o resumen diario a una hora fija",
      "Varios perfiles activos a la vez, cada uno con su interruptor",
      "Etiquetas de estado y de relevancia en cada aviso",
    ],
  },
  {
    key: "ficha" as const,
    eyebrow: "Ficha de licitación",
    title: "Cada expediente, ordenado y sin salir de la app.",
    desc: "Cronograma del proceso, información general, fechas clave, importes, códigos CPV con su descripción y el órgano de contratación en el mapa. También los pliegos y el historial de cambios.",
    points: [
      "Cronograma: publicación, fin de presentación y adjudicación",
      "Documentos y fuentes oficiales de cada expediente",
      "Historial de cambios de estado, fechas y resultado",
    ],
  },
  {
    key: "noa" as const,
    eyebrow: "Noa, asistente de IA",
    title: "Pregunta en lenguaje normal y Noa busca por ti.",
    desc: "Noa conoce las licitaciones de la plataforma: pregúntale por un sector, una zona o un importe y te resume las que están en plazo. También resuelve dudas sobre contratación pública y sobre los pliegos.",
    points: [
      "Búsquedas en lenguaje natural sobre licitaciones en plazo",
      "Dudas sobre CPV, requisitos y plazos",
      "Historial de conversaciones para retomar lo que estabas viendo",
    ],
  },
];

// Categorías reales del buscador de Elevate (para la cinta animada).
export const ELEVATE_CATEGORIES = [
  "Construcción y obras",
  "Informática (servicios)",
  "Mantenimiento y reparación",
  "Arquitectura e ingeniería",
  "Suministros públicos",
  "Educación y formación",
  "Vehículos y transporte",
  "Equipos médicos",
  "Energía y combustibles",
  "Material eléctrico",
  "Investigación y desarrollo",
  "Administración pública",
  "Informática (equipos)",
  "Materiales de construcción",
  "Maquinaria agrícola",
];

export const ELEVATE_FAQ = [
  {
    q: "¿De dónde salen las licitaciones?",
    a: "De la Plataforma de Contratación del Sector Público (PLACSP), la fuente oficial del Estado. Los datos se actualizan a diario.",
  },
  {
    q: "¿Cubre todas las comunidades autónomas?",
    a: "Todavía no. Algunas comunidades publican en sus propias plataformas autonómicas y aún no están incluidas; estamos trabajando para incorporarlas.",
  },
  {
    q: "¿Cómo decide Elevate qué es relevante?",
    a: "Cada perfil que creas (CPV, palabras clave, importe, zona) se compara con cada licitación y la IA le asigna una puntuación de encaje. Solo te llega lo que la supera.",
  },
  {
    q: "¿Necesito tarjeta para empezar?",
    a: "No. El plan gratuito no pide tarjeta y puedes crear tu primer perfil de búsqueda en un par de minutos. Si necesitas más, el plan Pro cuesta 35 € al mes con IVA incluido.",
  },
];
