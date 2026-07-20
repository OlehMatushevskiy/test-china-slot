import { useEffect, useState } from "react";
import { Game } from "../core/Game";

const currency = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function SpinResultBanner() {
  const [slotState, setSlotState] = useState(Game.slotState);

  useEffect(() => {
    Game.events.onSlotStateChangedEvent.subscribe(setSlotState);
    return () => Game.events.onSlotStateChangedEvent.unsubscribe(setSlotState);
  }, []);

  const result = slotState.result;
  const isPresentingWin = slotState.phase === "presentingWin";

  if (!isPresentingWin || !result) return null;

  return (
    <section className="spin-result" role="status" aria-live="polite">
      <span className="spin-result__title">Fortune Win</span>
      <strong className="spin-result__amount">
        +${currency.format(result.winAmount)}
      </strong>
    </section>
  );
}
