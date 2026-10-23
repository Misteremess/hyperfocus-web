# Contenido pendiente para la web

Última revisión: 23-oct-2026 (tras los bloques 1, 2 y 3 de la auditoría).
Todo lo que falta para que la web quede completa. Cada punto dice **dónde se coloca** y **qué hay que tocar en el código** cuando llegue.

## 1. Contenido gráfico

| # | Qué | Formato recomendado | Dónde va | Qué tocar |
|---|-----|---------------------|----------|-----------|
| 1 | ~~Retrato de Ignacio~~ ✅ Puesto (`/images/equipo/ignacio-trabajando`). Opcional: un retrato de estudio con fondo neutro para las tarjetas | | | |
| 2 | ~~Retrato de Máximo~~ ✅ Puesto (`/images/equipo/maximo-trabajando`) | | | |
| 3 | ~~Fotos trabajando~~ ✅ 5 fotos en el carrusel de Sobre nosotros (`TEAM_PHOTOS` en `site.ts`) | | | |
| 4 | ~~Capturas reales de Elevate~~ ✅ Hechas (5 capturas en `/elevate`, portada y Software). Para añadir más: WebP 1600 px + versión `-800`, y `ELEVATE.screenshots` en `src/data/site.ts` | | | |
| 5 | **Logo de Elevate** en SVG (versión clara para fondo oscuro) | SVG | Cabecera de `/elevate` y bloque Elevate de la portada | Añadir en `ElevatePage.tsx` y `HomeSections.tsx` |
| 6 | **Vídeo corto de Elevate** (opcional): 15–30 s navegando la app | 1280 px, sin audio, MP4 + WebM < 1 MB cada uno | `/elevate` | Usar el componente `LazyVideo` |
| 7 | **Imagen para redes (Open Graph)** de portada y de Elevate. La actual es oscura y ya no encaja con el tema claro | 1200×630 px, JPG < 200 KB, fondo claro con logo y titular | Vista previa al compartir en WhatsApp, LinkedIn, etc. | Sustituir `public/og-image.jpg` y pasar `ogImage` en `src/pages/elevate.astro` |
| 8 | **Icono para iPhone** (apple-touch-icon) | PNG 180×180 px | Icono al guardar la web en el móvil | Hoy apunta a `favicon.svg`, que iOS no usa: crear `public/apple-touch-icon.png` y cambiar el `<link>` en `HomeLayout.astro` |
| 9 | **Proyectos web reales** con capturas o vídeo | Igual que la demo actual | Galería de `/servicios/webs` (hoy solo queda la demo de consultora) | `PROJECTS` en `WebsPage.tsx` |
| 10 | **Demo real de un agente de IA** (grabación de pantalla o vídeo de una conversación) | MP4 + WebM < 1 MB | `/servicios/agentes-ia`, donde hoy pone «Demo interactiva — próximamente» | `DemoSection` en `AgentesIAPage.tsx` |
| 11 | **Caso Gatalogistic** (tarea 113): ✅ publicado como caso en curso con su logo (`/reflexiones/caso-gatalogistic`). **Falta:** una frase del cliente para el testimonio, el logo en SVG o PNG grande (el de su web es un JPG de 200 px) y las cifras al cerrar la primera fase | | | |
| 13 | **Imagen de portada para cada artículo** del blog (opcional) | 1200×630 px, WebP/JPG | Listado de `/reflexiones` y vista previa al compartir | Añadir campo `cover` al esquema en `src/content.config.ts` |
| 14 | **Demo real del agente de WhatsApp** (tarea 125): grabación de 30–60 s de una conversación real | MP4 + WebM < 1 MB | `/servicios/agentes-ia` | Sustituir `features.demo` en `src/content/servicios/agentes-ia.json` |
| 12 | ~~Vídeo de cabecera~~ Ya no hace falta: con el tema claro las cabeceras usan fotos reales y diseño tipográfico. Los vídeos abstractos se han eliminado | | | |

## 2. Datos y decisiones pendientes

- **Aviso legal y privacidad:** nombre del titular, NIF y domicilio → `LEGAL` en `src/data/site.ts`. Mientras no estén, la web muestra los marcadores `[TU NOMBRE…]`. **No publicar así.**
- ~~Teléfono y WhatsApp~~ ✅ Confirmados: 626 05 02 58 y 617 64 47 86 (`SITE.phone`, `SITE.phone2`). El botón flotante de WhatsApp usa el primero.
- **Enlace para reservar llamada** (calendario de Odoo o Calendly) → `SITE.booking`. Aparece solo en contacto y pie cuando se rellena.
- **LinkedIn:** página de empresa → `SITE.linkedin`; perfiles de Ignacio y Máximo → `FOUNDERS[].linkedin`.
- **Textos del equipo:** revisar la frase de cada uno en `FOUNDERS[].focus` (roles tomados de Odoo: CTO y CMO). LinkedIn bloquea la lectura automática de los perfiles: si queréis una biografía más completa (experiencia, formación), pegad el texto de vuestro «Acerca de».
- **Gatalogistic:** confirmar que el cliente acepta aparecer por su nombre en Sobre nosotros.
- **ChillPocket** (tarea 108): se muestra como «Producto propio · App gratuita». Si está en las tiendas, pasad el enlace para enlazarlo desde la tarjeta.
- **Precio de Elevate:** ✅ Pro = 35 €/mes IVA incluido (en `ELEVATE.plans`). Revisad que la app no siga mostrando «Professional 29 €». El plan Agency sale como «Consultar»: si queréis publicar su precio (la landing dice 79 €), cambiadlo en `ELEVATE.plans`.
- **Cloudflare Turnstile:** clave pública (`PUBLIC_TURNSTILE_SITE_KEY` al hacer la build) y secreta (`turnstile_secret` en `smtp_config.php`, fuera de `public_html`).
- **Google Analytics 4:** el contenedor GTM-P7CTB25W publicado no tiene ninguna etiqueta. Configurar GA4 y pasar el ID de medición para completar la tabla de cookies (`_ga_<ID>`).

## 3. Revisar antes de publicar

- **Los 6 artículos de `/reflexiones`** (tarea 124) están escritos y publicados en la build. Leedlos antes de desplegar: autor, fechas y tono. Para ocultar uno, pon `draft: true` en su cabecera.
- **Diseños de concepto:** las 18 maquetas están en carruseles de Software, Automatización y Agentes, rotuladas como «Concepto» y con un aviso de que no son proyectos de clientes. Si algún día una se convierte en proyecto real, muévela a `projects` del JSON del servicio. Los originales PNG están en `assets-src/` (fuera del repositorio).

## 4. Tareas manuales (fuera del código)

- Rotar la contraseña SMTP de info@hyperfocus.es (tarea 82).
- Poner el repositorio en privado (tarea 83).
- Sesión de fotos (tarea 98) → puntos 1–3 de la tabla.
- Google Business Profile y Search Console (tarea 103). La redirección de www a la versión sin www ya está en `public/.htaccess`: comprobar tras desplegar que `https://www.hyperfocus.es` responde con un 301.
- Crear la página de empresa en LinkedIn (tarea 107).
- Desplegar en Hostinger y revisarlo en producción (tarea 96).
- Crear las ramas `main` y `development` y proteger `main` (tarea 119): comandos en el README.
- Despliegue automático (tarea 121): añadir en GitHub los secretos `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` y `PUBLIC_TURNSTILE_SITE_KEY`, y comprobar la carpeta `server-dir` de `.github/workflows/deploy.yml`.
- El zip y los vídeos de stock ya no están en el repositorio, pero **siguen en el historial de git**. Si el repo ha sido público, considerad limpiar el historial (git filter-repo) antes de hacerlo privado o, al menos, confirmar la licencia de los vídeos.
