import { useEffect } from "react";
import { startMusic, stopMusic, isMusicPlaying, useGame } from "@/lib/game-store";

/** Arranca la música infantil de fondo en el primer toque del usuario. */
export function AudioBoot() {
  const game = useGame();

  useEffect(() => {
    if (!game.music) {
      stopMusic();
      return;
    }
    const kick = () => {
      if (!isMusicPlaying()) startMusic();
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, [game.music]);

  return null;
}
