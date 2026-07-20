import { useEffect, useState } from "react";
import { Game } from "../core/Game";

export function ZeroBalanceFrame() {
  const [slotState, setSlotState] = useState(Game.slotState);

  useEffect(() => {
    Game.events.onSlotStateChangedEvent.subscribe(setSlotState);
    return () => Game.events.onSlotStateChangedEvent.unsubscribe(setSlotState);
  }, []);

  const isVisible = slotState.phase === "idle" && slotState.balance === 0;

  if (!isVisible) return null;

  return (
    <section className="zero-balance-frame" role="alert">
      <span className="zero-balance-frame__title">Balance depleted</span>
      <strong className="zero-balance-frame__amount">$0.00</strong>
      <span className="zero-balance-frame__message">
        No credits remain for another spin.
      </span>
    </section>
  );
}
