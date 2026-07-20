import { useSlotState } from "../hooks/useSlotState";
import { useGame } from "../core/GameContext";

const currency = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function SpinResultBanner() {
  const { slotEngine } = useGame();
  const slotState = useSlotState(slotEngine);

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
