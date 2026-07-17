import { BackgroundBlock } from "../blocks/BackgroundBlock";
import { DragonSpineBlock } from "../blocks/DragonSpineBlock";
import { MusicToggleBlock } from "../blocks/MusicToggleBlock";
import { SlotBoardBlock } from "../blocks/SlotBoardBlock";
import { Game } from "../core/Game";
import { Scene } from "../core/GameScene";

export class MainGameScene extends Scene {
  async onEnter(): Promise<void> {
    await super.onEnter();
    Game.preloadSoundEffects();

    const backgroundBlock = new BackgroundBlock("Background");
    this.addBlock(backgroundBlock);

    const slotBoardBlock = new SlotBoardBlock("SlotBoard");
    this.addBlock(slotBoardBlock);

    const dragonSpineBlock = new DragonSpineBlock("DragonSpine");
    this.addBlock(dragonSpineBlock);

    const musicToggleBlock = new MusicToggleBlock("MusicToggle");
    this.addBlock(musicToggleBlock);
  }
}
