import { Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { DAILY_GOAL, useGame, sayResult } from "@/lib/game-store";
import { Confetti } from "@/components/game/Confetti";

export function StationShell({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: ReactNode;
}) {
  const game = useGame();
  const pct = Math.round((game.missionsToday / DAILY_GOAL) * 100);

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
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-xl leading-tight">
              <span className="mr-1">{emoji}</span>
              {title}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-grass transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                {game.missionsToday} de {DAILY_GOAL} misiones
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-sun px-3 py-2 font-display text-lg text-sun-foreground">
            <Star className="h-5 w-5 fill-current" />
            {game.stars}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
    </div>
  );
}

export function Prompt({ children }: { children: ReactNode }) {
  return (
    <div className="card-soft mb-5 px-5 py-4 text-center font-display text-2xl leading-snug">
      {children}
    </div>
  );
}

export function Feedback({ status }: { status: "idle" | "good" | "bad" }) {
  if (status === "idle") return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-30 grid place-items-center">
      <div
        className={`animate-pop-in rounded-4xl px-8 py-6 font-display text-4xl text-card ${
          status === "good" ? "bg-grass" : "bg-berry"
        }`}
      >
        {status === "good" ? "¡Muy bien! ⭐" : "¡Casi! Intenta otra vez"}
      </div>
    </div>
  );
}

export function BigButton({
  children,
  onClick,
  tone = "primary",
  active,
  disabled,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "primary" | "sun" | "grass" | "berry" | "card";
  active?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    sun: "bg-sun text-sun-foreground",
    grass: "bg-grass text-grass-foreground",
    berry: "bg-berry text-berry-foreground",
    card: "bg-card text-card-foreground",
  };
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`toy-press rounded-3xl px-5 py-4 font-display text-2xl disabled:opacity-50 ${tones[tone]} ${
        active ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
