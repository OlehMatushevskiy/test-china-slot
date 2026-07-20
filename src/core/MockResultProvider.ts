import type { SpinRequest, SpinResult, SpinResultProvider } from "./SlotEngine";
import { SLOT_CONFIG } from "./SlotConfig";

export class MockSpinResultProvider implements SpinResultProvider {
  constructor(private readonly random = Math.random) {}

  request(request: SpinRequest): Promise<SpinResult> {
    const reelStops = Array.from({ length: SLOT_CONFIG.reelCount }, () => {
      const randomValue = Math.max(0, Math.min(0.999_999, this.random()));
      return Math.floor(randomValue * SLOT_CONFIG.symbolCount);
    });

    const isWin = reelStops.every((item) => item === reelStops[0]);
    const winAmount = isWin
      ? request.bet * SLOT_CONFIG.winMultipliers[reelStops[0]]
      : 0;

    return Promise.resolve({
      ...request,
      reelStops,
      winAmount,
      balance: request.balance - request.bet + winAmount,
    });
  }
}
