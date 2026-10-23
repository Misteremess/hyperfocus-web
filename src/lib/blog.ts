import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"reflexiones">;

/** Entradas publicadas (sin borradores), de la más reciente a la más antigua. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("reflexiones", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Minutos de lectura aproximados (220 palabras por minuto). */
export function readingTime(post: Post): number {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

// Llamada a la acción al final de cada artículo según su tema.
export const RELATED_CTA: Record<
  NonNullable<Post["data"]["related"]>,
  { title: string; text: string; href: string; label: string }
> = {
  elevate: {
    title: "¿Tu empresa licita?",
    text: "Elevate te avisa de las licitaciones públicas que encajan con tu negocio. El plan gratuito no pide tarjeta.",
    href: "/elevate",
    label: "Conocer Elevate",
  },
  software: {
    title: "¿Tu Excel ya no da más de sí?",
    text: "Hacemos herramientas a medida para pymes, con presupuesto cerrado o por horas.",
    href: "/servicios/software",
    label: "Ver software a medida",
  },
  "agentes-ia": {
    title: "¿Quieres un agente que conteste por ti?",
    text: "Diseñamos agentes de IA para WhatsApp, email, web y teléfono, con el tono de tu marca.",
    href: "/servicios/agentes-ia",
    label: "Ver agentes de IA",
  },
  automatizacion: {
    title: "¿Tienes un proceso que se repite cada semana?",
    text: "Conectamos las herramientas que ya usáis para que las tareas repetitivas se hagan solas.",
    href: "/servicios/automatizacion",
    label: "Ver automatización",
  },
  webs: {
    title: "¿Tu web no te trae contactos?",
    text: "Hacemos webs rápidas, claras y pensadas para que te escriban.",
    href: "/servicios/webs",
    label: "Ver webs",
  },
};
