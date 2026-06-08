# hyperfocus-web — Reglas del proyecto

## Responsive (OBLIGATORIO)

Todo componente o sección que se implemente **debe funcionar correctamente en mobile, tablet y desktop**.

- Mobile-first: escribe los estilos base para pantallas pequeñas y usa breakpoints (`sm:`, `md:`, `lg:`) para escalar hacia arriba.
- Ningún elemento debe quedar cortado, solapado o ilegible en viewports < 390px.
- Si un bloque tiene una versión distinta por breakpoint (ej. carrusel en mobile, lista en desktop), implementa **ambas versiones** en el mismo componente usando utilidades de visibilidad (`block lg:hidden` / `hidden lg:block`).
- Prueba siempre al menos en 390px (iPhone SE), 768px (tablet) y 1280px (desktop) antes de dar la tarea por terminada.
