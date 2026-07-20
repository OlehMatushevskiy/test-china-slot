import { BalanceFrame } from "./slot-controls/BalanceFrame";
import { BetControls } from "./slot-controls/BetControls";
import { SpinButton } from "./slot-controls/SpinButton";
import { useGame } from "../core/GameContext";
import { SLOT_BET_STEP, SLOT_MIN_BET } from "../core/SlotEngine";
import { useSlotState } from "../hooks/useSlotState";

const currency = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function SlotControls() {
  const { slotEngine } = useGame();
  const slotState = useSlotState(slotEngine);

  const isBusy = slotState.phase !== "idle";
  const canSpin = !isBusy && slotState.balance >= slotState.bet;

  return (
    <section className="slot-controls" aria-label="Slot controls">
      <BalanceFrame amount={`$${currency.format(slotState.balance)}`} />
      <BetControls
        amount={`$${currency.format(slotState.bet)}`}
        canDecrease={!isBusy && slotState.bet > SLOT_MIN_BET}
        canIncrease={!isBusy && slotState.bet + SLOT_BET_STEP <= slotState.balance}
        onDecrease={() => slotEngine.adjustBet(-SLOT_BET_STEP)}
        onIncrease={() => slotEngine.adjustBet(SLOT_BET_STEP)}
      />
      <SpinButton
        disabled={!canSpin}
        isSpinning={isBusy}
        onSpin={() => slotEngine.requestSpin()}
      />
    </section>
  );
}
