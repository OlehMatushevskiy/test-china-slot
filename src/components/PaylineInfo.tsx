import { useState } from "react";
import dragonSymbol from "../../assets/symbol-lucky-dragon.webp";
import lanternSymbol from "../../assets/symbol-red-lantern.webp";
import coinSymbol from "../../assets/symbol-golden-ingot.webp";

type Payline = {
  label: string;
  symbol: string;
  multiplier: string;
};

const PAYLINES: Payline[] = [
  { label: "Dragons", symbol: dragonSymbol, multiplier: "3×" },
  { label: "Lanterns", symbol: lanternSymbol, multiplier: "2×" },
  { label: "Coins", symbol: coinSymbol, multiplier: "5×" },
];

export function PaylineInfo() {
  const [isOpen, setIsOpen] = useState(
    () => window.innerWidth > 560 && window.innerHeight > 600,
  );

  return (
    <aside
      className={`payline-info${isOpen ? "" : " payline-info--collapsed"}`}
      aria-label="Payline information"
    >
      <div className="payline-info__heading">
        <span className="payline-info__title">Paylines</span>
        {isOpen && <span className="payline-info__rule">3 in a row</span>}
        <button
          className="payline-info__toggle"
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Hide payline information" : "Show payline information"}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
        </button>
      </div>
      {isOpen && (
        <ul className="payline-info__list">
          {PAYLINES.map(({ label, symbol, multiplier }) => (
            <li className="payline-info__row" key={label}>
              <span className="payline-info__symbols" aria-hidden="true">
                {[0, 1, 2].map((index) => (
                  <img src={symbol} alt="" key={index} />
                ))}
              </span>
              <span className="payline-info__payout">
                <span className="payline-info__name">{label}</span>
                <strong>{multiplier}</strong>
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
