import { Container, Graphics, Text } from "pixi.js";
import { Block } from "../core/Block";
import type { AppProvider } from "../core/AppProvider";

export class LoadingErrorBlock extends Block {
  private readonly container = new Container();
  private readonly retryButton = new Graphics();
  private title?: Text;
  private message?: Text;
  private retryLabel?: Text;

  constructor(
    name: string,
    private readonly getApp: AppProvider,
    private readonly onRetry: () => void,
  ) {
    super(name);
  }

  start(): void {
    this.title = new Text({
      text: "UNABLE TO LOAD GAME",
      anchor: 0.5,
      style: {
        fill: 0xffd0c4,
        fontFamily: "Cinzel Decorative",
        fontSize: 21,
        fontWeight: "700",
        letterSpacing: 2,
      },
    });
    this.message = new Text({
      text: "Check your connection and try again.",
      anchor: 0.5,
      style: {
        fill: 0xfff1c4,
        fontFamily: "Cinzel Decorative",
        fontSize: 14,
      },
    });
    this.retryLabel = new Text({
      text: "RETRY",
      anchor: 0.5,
      style: {
        fill: 0x24183d,
        fontFamily: "Cinzel Decorative",
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 1.4,
      },
    });

    this.retryButton
      .roundRect(-104, -25, 208, 50, 14)
      .fill({ color: 0xf7d774 })
      .stroke({ color: 0xfff1c4, width: 1.5, alpha: 0.95 });
    this.retryButton.eventMode = "static";
    this.retryButton.cursor = "pointer";
    this.retryButton.on("pointertap", this.onRetry);

    this.container.addChild(
      this.title,
      this.message,
      this.retryButton,
      this.retryLabel,
    );
    this.getApp()?.stage.addChild(this.container);
    this.updatePosition();
  }

  resize(): void {
    this.updatePosition();
  }

  end(): void {
    this.retryButton.off("pointertap", this.onRetry);
    this.container.parent?.removeChild(this.container);
    this.container.destroy({ children: true });
    this.title = undefined;
    this.message = undefined;
    this.retryLabel = undefined;
  }

  private updatePosition(): void {
    const app = this.getApp();
    if (!app || !this.title || !this.message || !this.retryLabel) return;

    this.container.position.set(app.screen.width / 2, app.screen.height / 2);
    this.title.position.set(0, -74);
    this.message.position.set(0, -34);
    this.retryButton.position.set(0, 28);
    this.retryLabel.position.set(0, 28);
  }
}
