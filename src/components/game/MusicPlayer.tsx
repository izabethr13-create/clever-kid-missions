import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, X } from "lucide-react";
import {
  MUSIC_TRACKS,
  gameActions,
  isMusicPlaying,
  startMusic,
  stopMusic,
  useGame,
} from "@/lib/game-store";

/** Reproductor flotante de música de fondo. */
export function MusicPlayer() {
  const game = useGame();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setPlaying(isMusicPlaying()), 400);
    return () => window.clearInterval(t);
  }, []);

  const track = MUSIC_TRACKS.find((t) => t.id === game.track) ?? MUSIC_TRACKS[0]!;

  const toggle = () => {
    if (isMusicPlaying()) {
      stopMusic();
      setPlaying(false);
    } else {
      startMusic();
      setPlaying(true);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="pointer-events-auto w-[17rem] rounded-3xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur">
          <div className="flex items-start gap-2">
            <span className="text-3xl">{track.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-tight">{track.label}</p>
              {/* Visualizador */}
              <div className="mt-1 flex h-4 items-end gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-primary transition-all"
                    style={{
                      height: playing ? `${6 + ((i * 5) % 11)}px` : "4px",
                      animation: playing
                        ? `float-soft ${0.6 + i * 0.15}s ease-in-out ${i * 0.1}s infinite alternate`
                        : "none",
                      opacity: playing ? 1 : 0.35,
                    }}
                  />
                ))}
                <span className="ml-2 text-xs font-bold text-muted-foreground">
                  {playing ? "Música sonando" : "En pausa"}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Cerrar reproductor"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground toy-press"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Canción anterior"
              onClick={() => gameActions.prevTrack()}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-secondary-foreground toy-press"
            >
              <SkipBack className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pausar música" : "Reproducir música"}
              onClick={toggle}
              className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground toy-press"
            >
              {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
            </button>
            <button
              type="button"
              aria-label="Canción siguiente"
              onClick={() => gameActions.nextTrack()}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-secondary-foreground toy-press"
            >
              <SkipForward className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Volume2 className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              aria-label="Volumen"
              value={Math.round((game.volume ?? 0.25) * 100)}
              onChange={(e) => gameActions.setVolume(Number(e.target.value) / 100)}
              className="w-full accent-primary"
            />
          </div>

          <label className="mt-3 block text-xs font-bold text-muted-foreground" htmlFor="pista">
            Elegir canción
          </label>
          <select
            id="pista"
            value={track.id}
            onChange={(e) => gameActions.setTrack(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-muted px-3 py-2 font-display text-base outline-none focus:ring-4 focus:ring-ring"
          >
            {MUSIC_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        aria-label="Abrir reproductor de música"
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto grid h-14 w-14 place-items-center rounded-full bg-sun text-sun-foreground shadow-xl toy-press"
      >
        <Music className={`h-7 w-7 ${playing ? "animate-float-soft" : ""}`} />
      </button>
    </div>
  );
}

export default MusicPlayer;
