import minusButton from "../../../assets/minus-button-centered.png";
import plusButton from "../../../assets/plus-button-matched.png";

type BetControlsProps = {
  amount: string;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function BetControls({
  amount,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
}: BetControlsProps) {
  return (
    <div className="slot-controls__bet" aria-label="Bet amount controls">
      <button
        className="slot-controls__icon-button"
        type="button"
        aria-label="Decrease bet"
        disabled={!canDecrease}
        onClick={onDecrease}
      >
        <img src={minusButton} alt="" />
      </button>
      <div className="slot-controls__bet-value">
        <span className="slot-controls__label">Bet</span>
        <output className="slot-controls__amount">{amount}</output>
      </div>
      <button
        className="slot-controls__icon-button"
        type="button"
        aria-label="Increase bet"
        disabled={!canIncrease}
        onClick={onIncrease}
      >
        <img src={plusButton} alt="" />
      </button>
    </div>
  );
}
