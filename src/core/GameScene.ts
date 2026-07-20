import { Container } from "pixi.js";
import { Block } from "./Block";
import type { AppProvider } from "./AppProvider";
import { GameEvent } from "./GameEvent";

export type SceneDependencies = {
  getApp: AppProvider;
  onWindowResize: GameEvent<void>;
};

export abstract class Scene extends Container {
  private blocks: Block[] = [];
  private active = false;

  private readonly handleResize = (): void => {
    this.resize();
  };

  constructor(protected readonly dependencies: SceneDependencies) {
    super();
  }

  onEnter(): void | Promise<void> {
    this.active = true;
    this.dependencies.onWindowResize.subscribe(this.handleResize);
  }
  onExit(): void | Promise<void> {
    this.active = false;
    this.dependencies.onWindowResize.unsubscribe(this.handleResize);
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
  protected isActive(): boolean {
    return this.active;
  }
}
