import { Container, Graphics, Text } from "pixi.js";
import { Block } from "../core/Block";
import { Game } from "../core/Game";

/** A scene-local control for the background music owned by Game. */
export class MusicToggleBlock extends Block {
  private readonly container = new Container();
  private readonly button = new Graphics();
  private readonly icon = new Graphics();
  private readonly label = new Text({
    text: "MUSIC ON",
    anchor: 0.5,
    style: {
      fill: 0xfff1b3,
      fontFamily: "Cinzel Decorative",
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.8,
    },
  });

  start(): void {
    this.button.eventMode = "static";
    this.button.cursor = "pointer";
    this.button.on("pointertap", this.toggleMusic);

    this.container.addChild(this.button, this.icon, this.label);
    Game.app?.stage.addChild(this.container);
    this.redraw();
    this.resize();
  }

  resize(): void {
    const app = Game.app;
    if (!app) return;

    const isCompactViewport = app.screen.width <= 560 || app.screen.height <= 600;
    const scale = isCompactViewport
      ? Math.min(0.82, Math.max(0.68, app.screen.width / 560))
      : Math.min(1, Math.max(0.8, app.screen.width / 720));
    const inset = isCompactViewport ? 10 : 18;
    this.container.scale.set(scale);
    this.container.position.set(inset, inset);
  }

  end(): void {
    this.button.off("pointertap", this.toggleMusic);
    this.container.parent?.removeChild(this.container);
    this.container.destroy({ children: true });
  }

  private readonly toggleMusic = (): void => {
    const isEnabled = Game.toggleSound();
    if (isEnabled) Game.startBackgroundMusic();
    this.redraw();
  };

  private redraw(): void {
    const isEnabled = Game.soundEnabled;
    const background = isEnabled ? 0x522014 : 0x2f1736;
    const border = isEnabled ? 0xf8d76f : 0xa88ac1;

    this.button.clear();
    this.button.roundRect(0, 0, 160, 42, 12);
    this.button.fill({ color: background, alpha: 0.9 });
    this.button.stroke({ color: border, width: 1.5, alpha: 0.95 });

    this.icon.clear();
    this.icon.moveTo(17, 18);
    this.icon.lineTo(23, 18);
    this.icon.lineTo(30, 12);
    this.icon.lineTo(30, 30);
    this.icon.lineTo(23, 24);
    this.icon.lineTo(17, 24);
    this.icon.closePath();
    this.icon.fill({ color: 0xffefac });
    this.icon.stroke({ color: 0x8d381b, width: 1, alpha: 0.75 });

    if (isEnabled) {
      this.icon.arc(30, 21, 8, -Math.PI / 3, Math.PI / 3);
      this.icon.stroke({ color: 0xffefac, width: 2 });
      this.icon.arc(30, 21, 13, -Math.PI / 3, Math.PI / 3);
      this.icon.stroke({ color: 0xffefac, width: 2 });
    } else {
      this.icon.moveTo(36, 14);
      this.icon.lineTo(49, 28);
      this.icon.moveTo(49, 14);
      this.icon.lineTo(36, 28);
      this.icon.stroke({ color: 0xffefac, width: 2.5 });
    }

    this.label.text = isEnabled ? "MUSIC ON" : "MUSIC OFF";
    this.label.position.set(103, 21);
  }
}
