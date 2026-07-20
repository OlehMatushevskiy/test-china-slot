import { Container, Graphics, Text } from "pixi.js";
import { Block } from "../core/Block";
import type { AppProvider } from "../core/AppProvider";
import type { AudioManager } from "../core/AudioManager";

export class MusicEnabledBlock extends Block {
  private readonly container = new Container();
  private readonly overlay = new Graphics();
  private readonly onButton = new Graphics();
  private readonly offButton = new Graphics();
  private title?: Text;
  private onLabel?: Text;
  private offLabel?: Text;
  private hasSelected = false;

  constructor(
    name: string,
    private readonly getApp: AppProvider,
    private readonly audioManager: AudioManager,
    private readonly continueToLoading: () => void,
  ) {
    super(name);
  }

  start(): void {
    this.title = new Text({
      text: "Audio enabled?",
      anchor: 0.5,
      style: {
        fill: 0xf7d774,
        fontFamily: "Cinzel Decorative",
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: 1.5,
      },
    });
    this.onLabel = this.createOptionLabel("ON");
    this.offLabel = this.createOptionLabel("OFF");

    this.configureButton(this.onButton, () => this.selectSound(true));
    this.configureButton(this.offButton, () => this.selectSound(false));

    this.container.addChild(
      this.overlay,
      this.title,
      this.onButton,
      this.offButton,
      this.onLabel,
      this.offLabel,
    );
    this.getApp()?.stage.addChild(this.container);
    this.updateButtons();
    this.updatePosition();
  }

  resize(): void {
    this.updatePosition();
  }

  end(): void {
    this.container.parent?.removeChild(this.container);
    this.container.destroy({ children: true });
    this.title = undefined;
    this.onLabel = undefined;
    this.offLabel = undefined;
  }

  private createOptionLabel(text: string): Text {
    return new Text({
      text,
      anchor: 0.5,
      style: {
        fill: 0xffffff,
        fontFamily: "Cinzel Decorative",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.2,
      },
    });
  }

  private selectSound(enabled: boolean): void {
    if (this.hasSelected) return;

    this.hasSelected = true;
    this.audioManager.setEnabled(enabled);
    if (enabled) this.audioManager.startBackgroundMusic();
    this.continueToLoading();
  }

  private configureButton(button: Graphics, onTap: () => void): void {
    button.eventMode = "static";
    button.cursor = "pointer";
    button.on("pointertap", () => {
      onTap();
      this.updateButtons();
    });
  }

  private updateButtons(): void {
    this.drawOption(this.onButton, this.audioManager.isEnabled());
    this.drawOption(this.offButton, !this.audioManager.isEnabled());
  }

  private drawOption(button: Graphics, selected: boolean): void {
    button.clear();
    button.roundRect(-115, -48, 230, 96, 24);
    button.fill({
      color: selected ? 0x6e3cb8 : 0x30214d,
      alpha: 0.95,
    });
    button.stroke({
      color: selected ? 0xf7d774 : 0x8e77bb,
      width: 1,
      alpha: 0.9,
    });
  }

  private updatePosition(): void {
    const app = this.getApp();
    if (!app) return;

    this.overlay.clear();
    this.overlay.rect(0, 0, app.screen.width, app.screen.height);
    this.overlay.fill({ color: 0x170f2c, alpha: 0.96 });
    this.overlay.eventMode = "static";

    this.container.position.set(
      app.screen.width / 2,
      app.screen.height / 2 - 20,
    );
    this.title?.position.set(0, -148);
    this.onButton.position.set(0, -40);
    this.offButton.position.set(0, 100);
    this.onLabel?.position.set(0, -40);
    this.offLabel?.position.set(0, 100);
  }
}
