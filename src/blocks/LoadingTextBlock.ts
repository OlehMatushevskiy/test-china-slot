import { Container, Text, Ticker } from "pixi.js";
import { Block } from "../core/Block";
import type { AppProvider } from "../core/AppProvider";

export class LoadingTextBlock extends Block {
  private readonly container = new Container();
  private title?: Text;
  private subtitle?: Text;
  private ticker?: Ticker;
  private elapsedMs = 0;

  constructor(name: string, private readonly getApp: AppProvider) {
    super(name);
  }

  start(): void {
    this.title = new Text({
      text: "PREPARING THE CHINA REELS",
      anchor: 0.5,
      style: {
        fill: 0xfff1c4,
        fontFamily: "Cinzel Decorative",
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: 3,
        dropShadow: { color: 0x9d5cff, alpha: 0.8, blur: 12, distance: 0 },
      },
    });
    this.subtitle = new Text({
      text: "Loading assets",
      anchor: 0.5,
      style: { fill: 0xf7d774, fontFamily: "Cinzel Decorative", fontSize: 15 },
    });

    this.container.addChild(this.title, this.subtitle);
    this.getApp()?.stage.addChild(this.container);
    this.updatePosition();

    this.ticker = new Ticker();
    this.ticker.add((ticker) => {
      if (!this.subtitle) return;
      this.elapsedMs += ticker.deltaMS;
      const dots = ".".repeat(Math.floor(this.elapsedMs / 380) % 4);
      this.subtitle.text = `Loading assets${dots}`;
      this.title!.alpha = 0.82 + Math.sin(this.elapsedMs * 0.002) * 0.12;
    });
    this.ticker.start();
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
    this.title = undefined;
    this.subtitle = undefined;
  }

  private updatePosition(): void {
    const app = this.getApp();
    if (!app || !this.title || !this.subtitle) return;

    this.container.position.set(
      app.screen.width / 2,
      app.screen.height / 2 - 58,
    );
    this.title.position.set(0, 0);
    this.subtitle.position.set(0, 34);
  }
}
