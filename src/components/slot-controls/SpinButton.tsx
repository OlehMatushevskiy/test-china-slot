import spinButton from "../../../assets/spin-button-centered.png";

type SpinButtonProps = {
  disabled: boolean;
  isSpinning: boolean;
  onSpin: () => void;
};

export function SpinButton({ disabled, isSpinning, onSpin }: SpinButtonProps) {
  return (
    <button
      className="slot-controls__spin"
      type="button"
      aria-label={isSpinning ? "Spinning" : "Spin"}
      disabled={disabled}
      onClick={onSpin}
    >
      <img src={spinButton} alt="" />
    </button>
  );
}
