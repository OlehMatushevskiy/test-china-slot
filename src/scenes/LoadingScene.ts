import { Assets } from "pixi.js";
import "@esotericsoftware/spine-pixi-v8";
import { LoadingErrorBlock } from "../blocks/LoadingErrorBlock";
import { LoadingTextBlock } from "../blocks/LoadingTextBlock";
import { ProgressBarBlock } from "../blocks/ProgressBarBlock";
import { Scene, type SceneDependencies } from "../core/GameScene";
import { gameAssets } from "../configs/GameAssets";
import { delay } from "../helpers/GameHelper";

export class LoadingScene extends Scene {
  private loadAttempt = 0;
  private isLoading = false;

  constructor(
    dependencies: SceneDependencies,
    private readonly showMainGame: () => void,
  ) {
    super(dependencies);
  }

  onEnter(): void {
    super.onEnter();
    this.startLoading();
  }

  override onExit(): void {
    this.loadAttempt += 1;
    this.isLoading = false;
    super.onExit();
  }

  private startLoading(): void {
    if (!this.isActive() || this.isLoading) return;

    const attempt = ++this.loadAttempt;
    this.isLoading = true;
    this.destroyAllBlocks();

    const loadingBlock = new LoadingTextBlock(
      "LoadingText",
      this.dependencies.getApp,
    );
    this.addBlock(loadingBlock);

    const progressBarBlock = new ProgressBarBlock(
      "ProgressBar",
      this.dependencies.getApp,
    );
    this.addBlock(progressBarBlock);

    void this.loadAssetsAndShowMain(attempt, progressBarBlock);
  }

  private async loadAssetsAndShowMain(
    attempt: number,
    progressBarBlock: ProgressBarBlock,
  ): Promise<void> {
    try {
      const startedAt = performance.now();
      const minimumLoadingTimeMs = 1400;

      await Assets.load(gameAssets, (progress) => {
        if (this.isCurrentLoad(attempt)) progressBarBlock.setProgress(progress);
      });

      if (!this.isCurrentLoad(attempt)) return;
      progressBarBlock.setProgress(1);

      const elapsedMs = performance.now() - startedAt;
      const remainingMs = Math.max(0, minimumLoadingTimeMs - elapsedMs);
      await delay(remainingMs);

      if (!this.isCurrentLoad(attempt)) return;
      this.isLoading = false;
      this.showMainGame();
    } catch (error) {
      if (!this.isCurrentLoad(attempt)) return;

      this.isLoading = false;
      console.error("Failed to load game assets", error);
      this.showLoadingError();
    }
  }

  private showLoadingError(): void {
    this.destroyAllBlocks();
    this.addBlock(
      new LoadingErrorBlock(
        "LoadingError",
        this.dependencies.getApp,
        () => this.startLoading(),
      ),
    );
  }

  private isCurrentLoad(attempt: number): boolean {
    return this.isActive() && this.loadAttempt === attempt;
  }
}
