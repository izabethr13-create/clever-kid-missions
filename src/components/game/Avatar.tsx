import { PRIZES, useGame } from "@/lib/game-store";

export function Avatar({ size = 96 }: { size?: number }) {
  const game = useGame();
  const hat = PRIZES.find((p) => p.id === game.avatar.hat);
  const item = PRIZES.find((p) => p.id === game.avatar.item);

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      {hat && (
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: -size * 0.28, fontSize: size * 0.45 }}
        >
          {hat.emoji}
        </span>
      )}
      <div
        className="grid h-full w-full place-items-center rounded-full border-4 border-card"
        style={{ background: game.avatar.color, fontSize: size * 0.5 }}
      >
        <span>🙂</span>
      </div>
      {item && (
        <span
          className="absolute -right-1 bottom-0"
          style={{ fontSize: size * 0.38 }}
        >
          {item.emoji}
        </span>
      )}
    </div>
  );
}
