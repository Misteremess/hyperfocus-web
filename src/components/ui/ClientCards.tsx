import { CLIENTS } from "../../data/site";
import { Reveal } from "./Reveal";

/** Clientes que nos permiten nombrarlos, con su logo y el enlace a su caso. */
export default function ClientCards() {
  return (
    <div className="grid gap-4">
      {CLIENTS.map((c) => (
        <Reveal key={c.name}>
          <article className="group flex flex-col gap-6 rounded-2xl border border-ink/10 bg-ink/[0.03] p-6 transition duration-300 hover:border-ink/25 sm:flex-row sm:items-center sm:p-8">
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Web de ${c.name}`}
              className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-[#ffffff] p-4 sm:w-48"
            >
              <img
                src={c.logo}
                alt={`Logotipo de ${c.name}`}
                width={200}
                height={86}
                loading="lazy"
                className="max-h-full w-auto"
              />
            </a>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                {c.sector} · {c.city}
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-ink">{c.name}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-ink/65">{c.summary}</p>
              <a
                href={c.caseUrl}
                className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink underline-offset-4 hover:underline"
              >
                Leer el caso{" "}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
