import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import { useGame, type StationId } from "@/lib/game-store";

export type ModuleCard = {
  id: StationId;
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
  color?: string;
};

export interface RegionShellProps {
  title: string;
  emoji?: string;
  intro?: string;
  modules?: ModuleCard[];
  children?: React.ReactNode;
}

export function RegionShell({
  title,
  emoji = "🏝️",
  intro,
  modules = [],
  children,
}: RegionShellProps) {
  const game = useGame();

  return (
    <div className="min-h-screen pb-16 bg-background text-foreground">
      {/* Encabezado */}
      <header className="sticky top-0 z-20 border-b border-border/80 bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            aria-label="Volver al mapa"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground toy-press"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate font-display text-xl flex items-center">
            <span className="mr-1">{emoji}</span>
            <span className="truncate">{title}</span>
          </h1>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="mx-auto max-w-3xl px-4 pt-6">
        {intro && (
          <p className="mb-6 text-center text-muted-foreground font-medium">
            {intro}
          </p>
        )}

        {modules.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {modules.map((mod) => (
              <Link
                key={mod.id}
                to={mod.to as any}
                className={`group relative flex flex-col justify-between rounded-3xl p-5 shadow-sm transition-all hover:scale-[1.02] ${
                  mod.color || "bg-card text-card-foreground border border-border"
                }`}
              >
                <div>
                  <div className="text-4xl mb-2">{mod.emoji}</div>
                  <h3 className="font-bold text-lg">{mod.title}</h3>
                  <p className="text-sm opacity-80 mt-1">{mod.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {children}
      </main>
    </div>
  );
}

export default RegionShell;
