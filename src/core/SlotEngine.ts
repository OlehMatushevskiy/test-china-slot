import { GameEvent } from "./GameEvent";
import { SLOT_CONFIG } from "./SlotConfig";

export const SLOT_MIN_BET = SLOT_CONFIG.minBet;
export const SLOT_BET_STEP = SLOT_CONFIG.betStep;

export type SlotPhase =
  | "idle"
  | "requesting"
  | "spinning"
  | "presentingWin"
  | "presentingLoss";

export type SpinRequest = {
  spinId: number;
  bet: number;
  balance: number;
};

export type SpinResult = SpinRequest & {
  reelStops: number[];
  winAmount: number;
  balance: number;
};

export type SlotState = {
  phase: SlotPhase;
  bet: number;
  balance: number;
  spinId?: number;
  result?: SpinResult;
};

export interface SpinResultProvider {
  request(request: SpinRequest): Promise<SpinResult>;
}

export class SlotEngine {
  private nextSpinId = 0;

  private state: SlotState = {
    phase: "idle",
    bet: SLOT_CONFIG.minBet,
    balance: SLOT_CONFIG.initialBalance,
  };

  readonly onStateChanged = new GameEvent<SlotState>("SlotStateChanged");
  readonly onSpinReady = new GameEvent<SpinResult>("SpinReady");

  constructor(private readonly resultProvider: SpinResultProvider) {}

  getState(): SlotState {
    return this.state;
  }

  adjustBet(amount: number): void {
    if (this.state.phase !== "idle") return;

    const bet = Math.max(
      SLOT_CONFIG.minBet,
      Math.min(this.state.balance, this.state.bet + amount),
    );

    if (bet !== this.state.bet) {
      this.setState({ ...this.state, bet });
    }
  }

  requestSpin(): boolean {
    if (this.state.phase !== "idle" || this.state.balance < this.state.bet) {
      return false;
    }

    const request: SpinRequest = {
      spinId: ++this.nextSpinId,
      bet: this.state.bet,
      balance: this.state.balance,
    };

    this.setState({
      ...this.state,
      phase: "requesting",
      spinId: request.spinId,
      result: undefined,
    });

    void this.resultProvider
      .request(request)
      .then((result) => this.acceptResult(result))
      .catch(() => this.rejectResult(request.spinId));

    return true;
  }

  /** Accepts a validated outcome before the Pixi layer starts reel animation. */
  acceptResult(result: SpinResult): void {
    if (
      this.state.phase !== "requesting" ||
      this.state.spinId !== result.spinId ||
      this.state.bet !== result.bet ||
      !this.isValidResult(result)
    ) {
      return; // застарілий або скасований результат
    }

    this.setState({
      ...this.state,
      phase: "spinning",
      balance: result.balance,
      result,
    });

    this.onSpinReady.emit(result);
  }

  /** Called by the presentation layer after all reels stop. */
  startResultPresentation(spinId: number): boolean {
    const result = this.state.result;

    if (
      this.state.phase !== "spinning" ||
      !result ||
      this.state.spinId !== spinId
    ) {
      return false;
    }

    this.setState({
      ...this.state,
      phase: result.winAmount > 0 ? "presentingWin" : "presentingLoss",
    });
    return true;
  }

  /** Called by the presentation layer after its result visibility duration. */
  finishPresentation(spinId: number): boolean {
    if (this.state.spinId !== spinId) return false;

    this.setState({
      ...this.state,
      phase: "idle",
      spinId: undefined,
      result: undefined,
    });
    return true;
  }

  cancelActiveSpin(): void {
    if (this.state.phase === "idle") return;

    this.setState({
      ...this.state,
      phase: "idle",
      spinId: undefined,
      result: undefined,
    });
  }

  private rejectResult(spinId: number): void {
    if (this.state.phase === "requesting" && this.state.spinId === spinId) {
      this.setState({
        ...this.state,
        phase: "idle",
        spinId: undefined,
      });
    }
  }

  private setState(state: SlotState): void {
    this.state = state;
    this.onStateChanged.emit(state);
  }

  private isValidResult(result: SpinResult): boolean {
    return (
      result.reelStops.length === SLOT_CONFIG.reelCount &&
      result.reelStops.every(
        (stop) =>
          Number.isInteger(stop) &&
          stop >= 0 &&
          stop < SLOT_CONFIG.symbolCount,
      ) &&
      Number.isFinite(result.winAmount) &&
      result.winAmount >= 0 &&
      Number.isFinite(result.balance) &&
      result.balance >= 0
    );
  }
}
