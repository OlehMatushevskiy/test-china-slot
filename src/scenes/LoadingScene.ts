import { Assets } from "pixi.js";
import "@esotericsoftware/spine-pixi-v8";
import { LoadingTextBlock } from "../blocks/LoadingTextBlock";
import { ProgressBarBlock } from "../blocks/ProgressBarBlock";
import { Scene } from "../core/GameScene";
import { gameAssets } from "../configs/GameAssets";
import { delay } from "../helpers/GameHelper";
import { Game, GameScene } from "../core/Game";

export class LoadingScene extends Scene {
  async onEnter(): Promise<void> {
    super.onEnter();
    const startedAt = performance.now();
    const minimumLoadingTimeMs = 1400;

    const loadingBlock = new LoadingTextBlock("LoadingText");
    this.addBlock(loadingBlock);

    const progressBarBlock = new ProgressBarBlock("ProgressBar");
    this.addBlock(progressBarBlock);

    await Assets.load(gameAssets, (progress) => {
      progressBarBlock.setProgress(progress);
    });

    progressBarBlock.setProgress(1);

    const elapsedMs = performance.now() - startedAt;
    const remainingMs = Math.max(0, minimumLoadingTimeMs - elapsedMs);
    await delay(remainingMs);

    Game.setScene(GameScene.MAIN_GAME);
  }
}
