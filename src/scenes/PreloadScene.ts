import { MusicEnabledBlock } from "../blocks/AudioEnabledBlock";
import { Scene } from "../core/GameScene";

export class PreloadScene extends Scene {
  onEnter(): void {
    super.onEnter();

    const musicEnabledBlock = new MusicEnabledBlock("MusicEnabledUI");
    this.addBlock(musicEnabledBlock);
  }
}
