import { gsap } from "gsap";
import { Block } from "../core/Block";
import { DemoSpinResult, Game } from "../core/Game";
import { GameAssetsAlias } from "../configs/GameAssets";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

export class DragonSpineBlock extends Block {
  private dragon?: Spine;
  private reactionTimeline?: gsap.core.Timeline;
  private pendingWin = false;
  private baseScale = 0.56;
  private readonly handleSpinRequest = (result: DemoSpinResult): void => {
    this.pendingWin = result.reelStops.every(
      (symbol) => symbol === result.reelStops[0],
    );
  };
  private readonly handleSpinStateChange = (isSpinning: boolean): void => {
    if (!isSpinning) this.presentResult();
  };

  constructor(name: string) {
    super(name);
  }

  start(): void {
    const app = Game.app;
    if (!app) return;

    this.dragon = Spine.from({
      skeleton: GameAssetsAlias.DRAGON_DATA,
      atlas: GameAssetsAlias.DRAGON_ATLAS,
      scale: this.baseScale,
    });
    this.dragon.state.data.defaultMix = 0.2;
    this.dragon.state.setAnimation(0, "flying", true);

    app.stage.addChild(this.dragon);
    Game.events.onSpinRequestedEvent.subscribe(this.handleSpinRequest);
    Game.events.onSpinStateChangedEvent.subscribe(this.handleSpinStateChange);
    this.resize();
  }

  override resize(): void {
    const app = Game.app;
    if (!app || !this.dragon) return;

    this.baseScale = Math.max(0.42, Math.min(0.68, app.screen.width / 2000));
    this.dragon.scale.set(this.baseScale);
    this.dragon.position.set(
      Math.max(150, app.screen.width * 0.16),
      app.screen.height * 0.46,
    );
  }

  override end(): void {
    this.reactionTimeline?.kill();
    this.reactionTimeline = undefined;
    Game.events.onSpinRequestedEvent.unsubscribe(this.handleSpinRequest);
    Game.events.onSpinStateChangedEvent.unsubscribe(this.handleSpinStateChange);
    this.dragon?.parent?.removeChild(this.dragon);
    this.dragon?.destroy({ children: true });
    this.dragon = undefined;
  }

  private presentResult(): void {
    if (!this.dragon) return;

    this.reactionTimeline?.kill();
    this.dragon.state.setAnimation(0, "flying", true);

    if (this.pendingWin) {
      this.dragon.state.timeScale = 2.1;
      this.dragon.alpha = 1;
      this.reactionTimeline = gsap
        .timeline({ onComplete: () => this.restoreIdleState() })
        .to(this.dragon.scale, {
          x: this.baseScale * 1.2,
          y: this.baseScale * 1.2,
          duration: 0.18,
          yoyo: true,
          repeat: 3,
          ease: "power2.out",
        });
      return;
    }

    this.dragon.state.timeScale = 0.5;
    this.reactionTimeline = gsap
      .timeline({ onComplete: () => this.restoreIdleState() })
      .to(this.dragon, { alpha: 0.55, duration: 0.2 })
      .to(this.dragon, { alpha: 0.8, duration: 0.45 });
  }

  private restoreIdleState(): void {
    if (!this.dragon) return;

    this.dragon.state.timeScale = 1;
    this.dragon.state.setAnimation(0, "flying", true);
    this.dragon.alpha = 1;
    this.dragon.scale.set(this.baseScale);
  }
}
