import { Container, Graphics, Text, Ticker } from "pixi.js";
import { Block } from "../core/Block";
import { Game } from "../core/Game";

export class ProgressBarBlock extends Block {
  private readonly container = new Container();
  private readonly fillLayer = new Container();
  private readonly width = 380;
  private readonly height = 24;
  private targetProgress = 0;
  private displayedProgress = 0;
  private ticker?: Ticker;

  start(): void {
    const track = new Graphics()
      .roundRect(0, 0, this.width, this.height, 12)
      .fill({ color: 0x24183d, alpha: 0.9 })
      .stroke({ color: 0xf7d774, alpha: 0.45, width: 1 });

    const glow = new Graphics()
      .roundRect(-4, -4, this.width + 8, this.height + 8, 16)
      .fill({ color: 0x9d5cff, alpha: 0.16 });

    const fill = new Graphics()
      .roundRect(0, 0, this.width, this.height, 12)
      .fill({ color: 0xf0ae3d, alpha: 1 });

    const highlight = new Graphics()
      .roundRect(2, 2, this.width - 4, 7, 4)
      .fill({ color: 0xffffff, alpha: 0.28 });

    this.fillLayer.addChild(fill, highlight);
    this.container.addChild(glow, track, this.fillLayer);
    Game.app?.stage.addChild(this.container);
    this.updatePosition();

    this.ticker = new Ticker();
    this.ticker.add((ticker) => {
      this.displayedProgress +=
        (this.targetProgress - this.displayedProgress) *
        Math.min(1, ticker.deltaMS / 180);
      this.fillLayer.scale.x = this.displayedProgress;
    });
    this.ticker.start();
  }

  setProgress(progress: number): void {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }

  resize(): void {
    this.updatePosition();
  }

  end(): void {
    this.ticker?.stop();
    this.ticker?.destroy();
    this.ticker = undefined;
    this.container.parent?.removeChild(this.container);
    this.container.destroy({ children: true });
  }

  private updatePosition(): void {
    const app = Game.app;
    if (!app) return;

    this.container.position.set(
      (app.screen.width - this.width) / 2,
      app.screen.height / 2 + 20,
    );
  }
}
