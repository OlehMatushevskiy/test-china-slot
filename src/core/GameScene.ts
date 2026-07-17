import { Container } from "pixi.js";
import { Block } from "./Block";
import { Game } from "./Game";

export abstract class Scene extends Container {
  blocks: Block[] = [];

  private readonly handleResize = (): void => {
    this.resize();
  };

  onEnter(): void | Promise<void> {
    Game.events.onWindowResizeEvent.subscribe(this.handleResize);
  }
  onExit(): void | Promise<void> {
    Game.events.onWindowResizeEvent.unsubscribe(this.handleResize);
    this.destroyAllBlocks();
  }
  addBlock(block: Block): void {
    block.start();
    this.blocks.push(block);
  }
  destroyAllBlocks(): void {
    this.blocks.forEach((element) => {
      element.end();
    });
    this.blocks = [];
    this.removeChildren();
  }
  resize(): void {
    this.blocks.forEach((element) => {
      element.resize();
    });
  }
}
