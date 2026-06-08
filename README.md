# hyperfocus-web

Sitio web de **Hyperfocus** — estudio de software, agentes de IA y automatización.
Construido con **Astro** (output estático) + **React** (islas) + **Tailwind CSS v4**.

## Requisitos

- Node.js ≥ 22.12.0

## Comandos

| Comando            | Acción                                          |
| :----------------- | :---------------------------------------------- |
| `npm install`      | Instala dependencias                            |
| `npm run dev`      | Servidor de desarrollo en `localhost:4321`      |
| `npm run build`    | Genera el sitio estático en `./dist/`           |
| `npm run preview`  | Previsualiza la build de producción localmente  |

## Variables de entorno

El formulario de contacto usa **EmailJS** (envío desde el cliente). Crea un archivo
`.env` en la raíz **antes de hacer `npm run build`** (los valores se hornean en el bundle):

```
PUBLIC_EMAILJS_SERVICE_ID=...
PUBLIC_EMAILJS_TEMPLATE_COMPANY=...
PUBLIC_EMAILJS_TEMPLATE_USER=...
PUBLIC_EMAILJS_PUBLIC_KEY=...
```

> En el panel de EmailJS activa la **allowlist de dominio** (`hyperfocus.es`) para evitar abuso.

## Despliegue (Hostinger, hosting estático)

1. `rm -rf dist && npm ci && npm run build`
2. Sube **el contenido de `dist/`** a `public_html/` (no la carpeta `dist` en sí).
3. No subas nunca: `node_modules/`, `src/`, `.git/`, `.env`, `.astro/`.

Astro genera HTML real por ruta, así que **no hace falta reescritura SPA** en `.htaccess`.
Ver el bloque `.htaccess` recomendado en las notas de despliegue.

## Estructura

```
src/
├── components/   # Islas React por feature (home, servicios, contacto, legal…)
├── layouts/      # HomeLayout.astro (head, SEO, transiciones)
├── pages/        # Rutas (.astro → HTML estático)
├── lib/          # Utilidades (cn)
└── styles/       # globals.css (Tailwind + tokens)
public/           # Assets estáticos (vídeos, imágenes, favicon)
```
