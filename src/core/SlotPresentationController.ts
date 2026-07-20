import { AudioManager } from "./AudioManager";
import { GameEvent } from "./GameEvent";
import { SlotEngine, type SpinResult } from "./SlotEngine";
import { SLOT_CONFIG } from "./SlotConfig";

/** Coordinates UI-only result presentation after Pixi reels reach their result. */
export class SlotPresentationController {
  private resultPresentationTimeout?: ReturnType<typeof setTimeout>;

  readonly onResultPresented = new GameEvent<SpinResult>("ResultPresented");

  constructor(
    private readonly slotEngine: SlotEngine,
    private readonly audioManager: AudioManager,
  ) {}

  completeReels(result: SpinResult): void {
    if (!this.slotEngine.startResultPresentation(result.spinId)) return;

    this.audioManager.playResult(result.winAmount > 0);
    this.onResultPresented.emit(result);
    this.clearPresentationTimeout();

    this.resultPresentationTimeout = setTimeout(() => {
      this.slotEngine.finishPresentation(result.spinId);
      this.resultPresentationTimeout = undefined;
    }, this.getPresentationDuration());
  }

  cancel(): void {
    this.clearPresentationTimeout();
    this.slotEngine.cancelActiveSpin();
  }

  dispose(): void {
    this.clearPresentationTimeout();
  }

  private clearPresentationTimeout(): void {
    if (this.resultPresentationTimeout === undefined) return;

    clearTimeout(this.resultPresentationTimeout);
    this.resultPresentationTimeout = undefined;
  }

  private getPresentationDuration(): number {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return prefersReducedMotion
      ? SLOT_CONFIG.reducedMotionResultPresentationDurationMs
      : SLOT_CONFIG.resultPresentationDurationMs;
  }
}
