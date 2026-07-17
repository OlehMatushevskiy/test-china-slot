type BalanceFrameProps = {
  amount: string;
};

export function BalanceFrame({ amount }: BalanceFrameProps) {
  return (
    <div className="slot-controls__wallet">
      <span className="slot-controls__label">Balance</span>
      <output className="slot-controls__amount">{amount}</output>
    </div>
  );
}
