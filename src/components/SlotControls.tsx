import { useEffect, useState } from "react";
import { BalanceFrame } from "./slot-controls/BalanceFrame";
import { BetControls } from "./slot-controls/BetControls";
import { SpinButton } from "./slot-controls/SpinButton";
import { Game } from "../core/Game";

const MIN_BET = 10;
const BET_STEP = 10;
const INITIAL_BALANCE = 1_000;

const currency = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function SlotControls() {
  const [bet, setBet] = useState(MIN_BET);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const setSpinState = (spinning: boolean) => setIsSpinning(spinning);
    Game.events.onSpinStateChangedEvent.subscribe(setSpinState);
    return () => Game.events.onSpinStateChangedEvent.unsubscribe(setSpinState);
  }, []);

  const canSpin = !isSpinning && balance >= bet;

  const changeBet = (amount: number) => {
    if (isSpinning) return;
    setBet((currentBet) => Math.max(MIN_BET, Math.min(balance, currentBet + amount)));
  };

  const spin = () => {
    if (!canSpin) return;

    setBalance((currentBalance) => currentBalance - bet);
    setIsSpinning(true);
    Game.requestDemoSpin();
  };

  return (
    <section className="slot-controls" aria-label="Slot controls">
      <BalanceFrame amount={`$${currency.format(balance)}`} />
      <BetControls
        amount={`$${currency.format(bet)}`}
        canDecrease={!isSpinning && bet > MIN_BET}
        canIncrease={!isSpinning && bet + BET_STEP <= balance}
        onDecrease={() => changeBet(-BET_STEP)}
        onIncrease={() => changeBet(BET_STEP)}
      />
      <SpinButton disabled={!canSpin} isSpinning={isSpinning} onSpin={spin} />
    </section>
  );
}
