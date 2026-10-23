# hyperfocus-web

Web de **Hyperfocus** (hyperfocus.es): estudio de software a medida, agentes de IA y automatización en Toledo.

Construida con **Astro 6** (sitio estático) + **Tailwind CSS v4**. React solo se usa en las partes interactivas
(menú, formulario de contacto, banner de cookies, portada, Elevate y Sobre nosotros). El formulario lo procesa un
script PHP en el propio hosting.

## Requisitos

- Node.js ≥ 22.12.0
- PHP 8 con `openssl` y `mbstring` (solo para probar el formulario en local)

## Comandos

| Comando                | Acción                                                   |
| :--------------------- | :------------------------------------------------------- |
| `npm install`          | Instala dependencias                                     |
| `npm run dev`          | Servidor de desarrollo en `localhost:4321`               |
| `npm run build`        | Genera el sitio estático en `./dist/`                    |
| `npm run preview`      | Previsualiza la build                                    |
| `npm run check`        | Comprueba tipos (`astro check`)                          |
| `npm run lint`         | ESLint                                                   |
| `npm run format`       | Formatea con Prettier (`format:check` solo comprueba)    |
| `npm run ci`           | Todo lo anterior + build, igual que en GitHub Actions    |

Para probar la web **con el formulario** en local: `npm run build && php -S localhost:4321 -t dist`.

## Dónde se edita cada cosa

| Qué                                                    | Dónde                                         |
| :----------------------------------------------------- | :-------------------------------------------- |
| Email, teléfonos, WhatsApp, LinkedIn, ciudad           | `src/data/site.ts` → `SITE`                   |
| Datos del titular (aviso legal y privacidad)           | `src/data/site.ts` → `LEGAL`                  |
| Equipo (nombre, rol, foto, LinkedIn)                   | `src/data/site.ts` → `FOUNDERS`               |
| Menú y pie                                             | `src/data/site.ts` → `NAV_ITEMS`, `FOOTER_COLUMNS` |
| Capturas de Elevate                                    | `src/data/site.ts` → `ELEVATE`                |
| Textos de cada servicio (`/servicios/<id>`)            | `src/content/servicios/<id>.json`             |
| Aviso legal, privacidad y cookies                      | `src/content/legal/*.md`                      |
| Artículos del blog (`/reflexiones`)                    | `src/content/reflexiones/*.md`                |

### Publicar un artículo

Crea `src/content/reflexiones/mi-articulo.md` con esta cabecera (el nombre del fichero es la URL):

```md
---
title: "Título del artículo"
description: "Resumen de 1–2 frases (máx. 170 caracteres): sale en Google y al compartir."
pubDate: 2026-11-03
author: "Ignacio Sánchez" # o "Máximo Du Perez" o "Equipo Hyperfocus"
category: "Automatización"
related: "automatizacion" # opcional: elevate | software | agentes-ia | automatizacion | webs
draft: false # true = no se publica
---
```

El listado, el RSS (`/reflexiones/rss.xml`) y el sitemap se actualizan solos.

## Formulario de contacto

- `public/api/contact.php` recibe el formulario, valida, limita envíos por IP, verifica Cloudflare Turnstile y envía
  dos correos con **PHPMailer** (copiado en `public/api/lib/PHPMailer`, sin Composer): uno a info@hyperfocus.es y un
  acuse con texto fijo al remitente.
- La contraseña SMTP y la clave secreta de Turnstile **no están en el repositorio**: van en `smtp_config.php`, fuera
  de `public_html` (ver `smtp_config.example.php`).
- La clave pública de Turnstile se pasa en la build: `PUBLIC_TURNSTILE_SITE_KEY=... npm run build`. Sin ella, el
  formulario funciona sin captcha.

## Despliegue (Hostinger)

**Automático:** al hacer merge a `main`, `.github/workflows/deploy.yml` ejecuta las comprobaciones, genera la build y
sube `dist/` a `public_html` por FTPS. Necesita estos secretos en GitHub (Settings → Secrets and variables →
Actions): `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` y, opcional, `PUBLIC_TURNSTILE_SITE_KEY`. Si la cuenta FTP
ya entra directamente en `public_html`, cambia `server-dir` a `./`.

**Manual:** `npm ci && npm run build` y sube **el contenido** de `dist/` a `public_html/`.

Una sola vez en el servidor: copia `smtp_config.example.php` a `/home/<usuario>/smtp_config.php` (fuera de
`public_html`) y rellénalo.

## Ramas

Mismo flujo que Elevate:

- `main`: lo que está en producción. Cada merge despliega.
- `development`: integración. Las nuevas funcionalidades salen de aquí y vuelven por PR.
- `hotfix/<nombre>`: arreglos urgentes desde `main`, que se fusionan en `main` y en `development`.

Para crearlas a partir de la rama actual (una vez hecho el commit):

```sh
git branch main && git branch development
git push -u origin main development
# En GitHub: Settings → Branches → rama por defecto = main, y protección de main (PR + CI obligatorio)
```

## Estructura

```
src/
├── components/   # Islas React (home, contacto, cookies, elevate…) y componentes .astro (servicios, pie)
├── content/      # Contenido editable: servicios (JSON), legales y blog (Markdown)
├── data/site.ts  # Datos compartidos: contacto, equipo, menú, Elevate
├── layouts/      # HomeLayout.astro (head, SEO, datos estructurados, transiciones)
├── lib/          # Utilidades del blog
├── pages/        # Rutas
└── styles/       # globals.css (Tailwind + estilos base)
public/           # Imágenes, vídeos (MP4 + WebM), .htaccess y api/ (formulario PHP)
assets-src/       # Originales de las capturas (no se publican)
docs/             # Contenido pendiente y notas
```
