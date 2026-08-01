import { createFileRoute } from "@tanstack/react-router";
import { Avatar } from "@/components/game/Avatar";
import { BigButton, StationShell } from "@/components/game/StationShell";
import { AVATAR_COLORS, PRIZES, gameActions, playSound, useGame } from "@/lib/game-store";

export const Route = createFileRoute("/premios")({
  head: () => ({
    meta: [
      { title: "Mis premios y mi avatar | El Mundo de los Números" },
      {
        name: "description",
        content:
          "Cambia el color de tu avatar y desbloquea gorros, varitas y mascotas con las estrellas que ganaste.",
      },
      { property: "og:title", content: "Mis premios y mi avatar" },
      {
        property: "og:description",
        content: "Usa tus estrellas para vestir a tu personaje.",
      },
    ],
  }),
  component: PremiosPage,
});

function PremiosPage() {
  const game = useGame();

  return (
    <StationShell title="Mis premios" emoji="🎁">
      <div className="card-soft grid place-items-center gap-3 px-4 pb-6 pt-12">
        <Avatar size={110} />
        <p className="font-display text-2xl">{game.name || "¡Hola!"}</p>
        <div className="flex gap-2">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => gameActions.setColor(c)}
              className={`h-10 w-10 rounded-full border-4 ${
                game.avatar.color === c ? "border-primary" : "border-card"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <h2 className="mt-6 font-display text-2xl">Accesorios</h2>
      <ul className="mt-3 grid grid-cols-2 gap-3">
        {PRIZES.map((p) => {
          const owned = game.unlocked.includes(p.id);
          const equipped = game.avatar[p.slot] === p.id;
          const canBuy = game.stars >= p.cost;
          return (
            <li key={p.id}>
              <BigButton
                tone={equipped ? "grass" : owned ? "card" : canBuy ? "sun" : "card"}
                className="w-full py-5"
                disabled={!owned && !canBuy}
                onClick={() => {
                  if (!owned) {
                    gameActions.unlock(p.id);
                    playSound("win");
                  }
                  gameActions.equip(p.slot, equipped ? null : p.id);
                }}
              >
                <span className="block text-4xl">{p.emoji}</span>
                <span className="block text-lg">{p.label}</span>
                <span className="block text-sm opacity-80">
                  {equipped ? "Puesto ✓" : owned ? "Tocar para poner" : `⭐ ${p.cost}`}
                </span>
              </BigButton>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-sm font-bold text-muted-foreground">
        Tienes {game.stars} estrellas en total
      </p>
    </StationShell>
  );
}
