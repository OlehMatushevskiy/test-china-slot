import { Assets, Text, Texture, Sprite } from "pixi.js";
import { Block } from "../core/Block";
import { Game } from "../core/Game";
import { GameAssetsAlias } from "../configs/GameAssets";

export class BackgroundBlock extends Block {
  private background: Sprite | undefined;

  constructor(name: string) {
    super(name);
  }

  start(): void {
    this.renderBackground();
  }
  private renderBackground(): void {
    const app = Game.app;

    if (!app) {
      return;
    }

    const texture = Assets.get<Texture>(GameAssetsAlias.BACKGROUND);

    this.background = new Sprite(texture);
    this.background.anchor.set(0.5, 0);
    this.resize();

    app.stage.addChild(this.background);
  }
  override resize(): void {
    this.updatePosition();
  }
  private updatePosition(): void {
    const app = Game.app;

    if (!app || !this.background) {
      return;
    }

    const originalWidth = this.background.texture.orig.width;
    const originalHeight = this.background.texture.orig.height;

    const imageAspectRatio = originalWidth / originalHeight;
    const screenAspectRatio = app.screen.width / app.screen.height;

    const scaleFactor =
      screenAspectRatio < imageAspectRatio
        ? app.screen.height / originalHeight
        : app.screen.width / originalWidth;

    this.background.width = originalWidth * scaleFactor;
    this.background.height = originalHeight * scaleFactor;
    this.background.x = app.screen.width / 2;
    this.background.y = 0;
  }

  override end(): void {
    this.background?.parent?.removeChild(this.background);
    this.background?.destroy();
    this.background = undefined;
  }
}
