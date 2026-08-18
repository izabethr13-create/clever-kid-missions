import { Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import { useGame, type StationId } from "@/lib/game-store";

export type ModuleCard = {
  id: StationId;
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
  intro: string;
  modules: ModuleCard[];
}) {
  const game = useGame();

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
          <h1 className="min-w-0 flex-1 truncate font-display text-xl">
            <span className="mr-1">{emoji}</span>
            {title}
          </h1>
          <span className="flex shrink-0 items-center gap-1 rounded-2xl bg-sun px-3 py-2 font-display text-lg text-sun-foreground">
            <Star className="h-5 w-5 fill-current" />
            {game.stars}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-6">
        <p className="text-center text-sm font-bold text-muted-foreground">{intro}</p>
        <ul className="mt-5 space-y-4">
          {modules.map((module, index) => (
            <li
              key={module.id}
              className={index % 2 === 0 ? "pr-4 sm:pr-12" : "pl-4 sm:pl-12"}
            >
              <Link
                to={module.to}
                className={`flex items-center gap-4 rounded-4xl px-5 py-5 toy-press ${module.color}`}
              >
                <span className="text-4xl">{module.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl leading-tight">{module.title}</span>
                  <span className="block text-sm font-bold opacity-80">{module.subtitle}</span>
                </span>
                <span className="flex items-center gap-1 rounded-full bg-card/40 px-2 py-1 text-sm font-bold">
                  <Star className="h-4 w-4 fill-current" />
                  {game.starsByStation[module.id]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
