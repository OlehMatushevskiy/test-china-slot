import { BackgroundBlock } from "../blocks/BackgroundBlock";
import { WispSpineBlock } from "../blocks/WispSpineBlock";
import { MusicToggleBlock } from "../blocks/AudioToggleBlock";
import { SlotBoardBlock } from "../blocks/SlotBoardBlock";
import { Game } from "../core/Game";
import { Scene } from "../core/GameScene";

export class MainGameScene extends Scene {
  async onEnter(): Promise<void> {
    await super.onEnter();
    Game.preloadSoundEffects();

    const backgroundBlock = new BackgroundBlock("Background");
    this.addBlock(backgroundBlock);

    const wispSpineBlock = new WispSpineBlock("WispSpine");
    this.addBlock(wispSpineBlock);

    const slotBoardBlock = new SlotBoardBlock("SlotBoard");
    this.addBlock(slotBoardBlock);

    const musicToggleBlock = new MusicToggleBlock("MusicToggle");
    this.addBlock(musicToggleBlock);
  }
}
