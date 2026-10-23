import { TEAM_PHOTOS } from "../../data/site";
import { Reveal } from "./Reveal";

// Mosaico de fotos reales del equipo: una grande y tres pequeñas.
// Clases por posición: la primera ocupa dos columnas y dos filas en escritorio.
const LAYOUT = [
  "col-span-2 aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:aspect-auto",
  "col-span-2 aspect-[16/9] lg:aspect-auto",
  "aspect-square lg:aspect-auto",
  "aspect-square lg:aspect-auto",
];

export default function TeamGallery() {
  const photos = TEAM_PHOTOS.slice(0, LAYOUT.length);
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:h-[560px] lg:grid-cols-4 lg:grid-rows-2">
      {photos.map((photo, i) => (
        <Reveal
          key={photo.src}
          delay={i * 0.08}
          className={`overflow-hidden rounded-2xl border border-ink/10 ${LAYOUT[i]}`}
        >
          <picture>
            <source media="(max-width: 640px)" srcSet={`${photo.src}-800.webp`} type="image/webp" />
            <img
              src={`${photo.src}.webp`}
              alt={photo.alt}
              width={1280}
              height={853}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
            />
          </picture>
        </Reveal>
      ))}
    </div>
  );
}
