// Colecciones de contenido: textos editables en Markdown sin tocar componentes.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Textos legales (aviso legal, privacidad, cookies).
// Los datos del titular se escriben como {{owner}}, {{taxId}}, {{address}} y
// se sustituyen con LEGAL de src/data/site.ts al generar la página.
const legal = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    subtitle: z.string(),
    seoTitle: z.string(),
    order: z.number(),
  }),
});

// Blog «Reflexiones».
const reflexiones = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/reflexiones" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.enum(["Ignacio Sánchez", "Máximo Du Perez", "Equipo Hyperfocus"]).default("Equipo Hyperfocus"),
    category: z.string(),
    // Servicio o producto relacionado: se muestra como llamada a la acción al final.
    related: z.enum(["elevate", "software", "agentes-ia", "automatizacion", "webs"]).optional(),
    draft: z.boolean().default(false),
  }),
});

// Páginas de servicios: todo el contenido de /servicios/<id> en un JSON.
// Las secciones opcionales que no estén en el JSON no se muestran.
const item = z.object({ icon: z.string(), label: z.string(), desc: z.string() });
const step = z.object({ title: z.string(), desc: z.string() });
const servicios = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/servicios" }),
  schema: z.object({
    order: z.number(),
    seo: z.object({ title: z.string(), description: z.string() }),
    card: z.object({ title: z.string(), desc: z.string() }),
    hero: z.object({
      eyebrow: z.string(),
      title: z.string(),
      intro: z.string(),
    }),
    tech: z.object({ intro: z.string(), items: z.array(z.string()) }).optional(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    principles: z.array(step).optional(),
    features: z.object({
      eyebrow: z.string(),
      title: z.string(),
      intro: z.string(),
      items: z.array(item),
      // Imagen de ejemplo junto a la lista (escritorio)
      demo: z.object({ image: z.string(), alt: z.string(), badge: z.string() }).optional(),
    }),
    process: z.object({ title: z.string(), intro: z.string(), steps: z.array(step) }),
    // Diseños de ejemplo (no son proyectos de clientes): carrusel «Ideas de lo que podemos construir».
    concepts: z.array(z.object({ name: z.string(), sector: z.string(), image: z.string() })).optional(),
    projects: z
      .object({
        title: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            tag: z.string(),
            accent: z.string(),
            // Marco de las capturas: móvil (vertical) o navegador (escritorio)
            frame: z.enum(["phone", "browser"]).default("phone"),
            images: z.array(z.string()).optional(),
            video: z.string().optional(),
            poster: z.string().optional(),
          }),
        ),
      })
      .optional(),
  }),
});

export const collections = { legal, reflexiones, servicios };
