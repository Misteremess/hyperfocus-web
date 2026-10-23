import { FOUNDERS } from "../../data/site";

// Tipo amplio: la foto o el LinkedIn pueden quedar vacíos.
const founders: readonly {
  name: string;
  short: string;
  role: string;
  focus: string;
  photo: string;
  linkedin: string;
}[] = FOUNDERS;
import { Reveal } from "../ui/Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

/** Tarjetas de los fundadores. Sin foto se muestran las iniciales. */
export default function FounderCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {founders.map((f, i) => (
        <Reveal
          key={f.name}
          delay={i * 0.08}
          className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.03]"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-ink/[0.06] to-transparent">
            {f.photo ? (
              <picture>
                <source media="(max-width: 640px)" srcSet={`${f.photo}-800.webp`} type="image/webp" />
                <img
                  src={`${f.photo}.webp`}
                  alt={`${f.name}, ${f.role}`}
                  width={1280}
                  height={853}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </picture>
            ) : (
              <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                <span className="text-5xl font-semibold tracking-[-0.04em] text-ink/25">{initials(f.name)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 p-6">
            <p className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{f.name}</p>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/55">{f.role}</p>
            <p className="mt-1 text-[14px] leading-[1.7] text-ink/65">{f.focus}</p>
            {f.linkedin && (
              <a
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-3 text-[13px] text-ink/75 underline-offset-4 hover:text-ink hover:underline"
              >
                LinkedIn de {f.short} →
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
