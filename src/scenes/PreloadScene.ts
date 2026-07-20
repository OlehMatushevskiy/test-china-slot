import { MusicEnabledBlock } from "../blocks/AudioEnabledBlock";
import type { AudioManager } from "../core/AudioManager";
import { Scene, type SceneDependencies } from "../core/GameScene";

export class PreloadScene extends Scene {
  constructor(
    dependencies: SceneDependencies,
    private readonly audioManager: AudioManager,
    private readonly continueToLoading: () => void,
  ) {
    super(dependencies);
  }

  onEnter(): void {
    super.onEnter();

    const musicEnabledBlock = new MusicEnabledBlock(
      "MusicEnabledUI",
      this.dependencies.getApp,
      this.audioManager,
      this.continueToLoading,
    );
    this.addBlock(musicEnabledBlock);
  }
}
