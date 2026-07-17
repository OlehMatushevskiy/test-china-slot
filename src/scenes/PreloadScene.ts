import { MusicEnabledBlock } from "../blocks/MusicEnabledBlock";
import { Scene } from "../core/GameScene";

export class PreloadScene extends Scene {
  onEnter(): void {
    super.onEnter();

    const musicEnabledBlock = new MusicEnabledBlock("MusicEnabledUI");
    this.addBlock(musicEnabledBlock);
  }
}
