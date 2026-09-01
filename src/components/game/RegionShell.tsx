import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export type ModuleCard = {
  id: string;
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
};

export function RegionShell({
  title,
  emoji,
  intro,
  modules,
}: {
  title: string;
  emoji: string;
  intro?: string;
  modules: ModuleCard[];
}) {
  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            aria-label="Volver al mapa"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground toy-press"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="truncate font-display text-xl leading-tight">
            <span className="mr-1">{emoji}</span>
            {title}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        {intro && (
          <p className="mb-5 text-center font-display text-xl leading-snug text-muted-foreground">
            {intro}
          </p>
        )}
        <ul className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                to={m.to}
                className={`flex h-full items-center gap-4 rounded-4xl px-5 py-6 toy-press ${m.color}`}
              >
                <span className="text-5xl">{m.emoji}</span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl leading-tight tracking-wide">
                    {m.title}
                  </span>
                  <span className="block text-sm font-bold opacity-80">{m.subtitle}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default RegionShell;
