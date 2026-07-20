import { BackgroundBlock } from "../blocks/BackgroundBlock";
import { WispSpineBlock } from "../blocks/WispSpineBlock";
import { MusicToggleBlock } from "../blocks/AudioToggleBlock";
import { SlotBoardBlock } from "../blocks/SlotBoardBlock";
import type { AudioManager } from "../core/AudioManager";
import { Scene, type SceneDependencies } from "../core/GameScene";
import type { SlotEngine } from "../core/SlotEngine";
import type { SlotPresentationController } from "../core/SlotPresentationController";

export class MainGameScene extends Scene {
  constructor(
    dependencies: SceneDependencies,
    private readonly slotEngine: SlotEngine,
    private readonly presentationController: SlotPresentationController,
    private readonly audioManager: AudioManager,
  ) {
    super(dependencies);
  }

  async onEnter(): Promise<void> {
    await super.onEnter();

    const backgroundBlock = new BackgroundBlock(
      "Background",
      this.dependencies.getApp,
    );
    this.addBlock(backgroundBlock);

    const wispSpineBlock = new WispSpineBlock(
      "WispSpine",
      this.dependencies.getApp,
      this.slotEngine,
      this.presentationController,
    );
    this.addBlock(wispSpineBlock);

    const slotBoardBlock = new SlotBoardBlock(
      "SlotBoard",
      this.dependencies.getApp,
      this.slotEngine,
      this.presentationController,
    );
    this.addBlock(slotBoardBlock);

    const musicToggleBlock = new MusicToggleBlock(
      "MusicToggle",
      this.dependencies.getApp,
      this.audioManager,
    );
    this.addBlock(musicToggleBlock);
  }
}
