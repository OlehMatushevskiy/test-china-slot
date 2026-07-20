import { Block } from "../core/Block";
import { DemoSpinResult, Game } from "../core/Game";
import { GameAssetsAlias } from "../configs/GameAssets";
import { getSlotBoardLayout } from "../configs/GameLayout";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

const WISP_BOUNDS = {
  x: -284.11,
  y: 161.68,
  width: 560.54,
  height: 730.53,
} as const;

const PHONE_WISP_MAX_SCALE = 0.2;
const DESKTOP_WISP_MIN_SCALE = 0.22;
const DESKTOP_WISP_MAX_SCALE = 0.34;

export class WispSpineBlock extends Block {
  private wisp?: Spine;
  private pendingWin = false;
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

    this.wisp = Spine.from({
      skeleton: GameAssetsAlias.WISP_DATA,
      atlas: GameAssetsAlias.WISP_ATLAS,
    });
    this.wisp.state.data.defaultMix = 0.2;
    this.wisp.state.setAnimation(0, "idle", true);

    app.stage.addChild(this.wisp);
    Game.events.onSpinRequestedEvent.subscribe(this.handleSpinRequest);
    Game.events.onSpinStateChangedEvent.subscribe(this.handleSpinStateChange);
    this.resize();
  }

  override resize(): void {
    const app = Game.app;
    if (!app || !this.wisp) return;

    const { width, height } = app.screen;
    const layout = getSlotBoardLayout(width, height);
    const topInset = layout.isPhone ? 44 : 16;
    const boardGap = layout.isPhone ? 8 : 16;
    const availableHeight = layout.boardTop - topInset - boardGap;
    const preferredScale = layout.isPhone
      ? PHONE_WISP_MAX_SCALE
      : Math.min(
          DESKTOP_WISP_MAX_SCALE,
          Math.max(DESKTOP_WISP_MIN_SCALE, layout.boardScale * 0.2),
        );
    const layoutScale = layout.isPhone
      ? Math.min(PHONE_WISP_MAX_SCALE, availableHeight / WISP_BOUNDS.height)
      : Math.min(preferredScale, availableHeight / WISP_BOUNDS.height);

    this.wisp.visible = layoutScale > 0;
    if (!this.wisp.visible) return;

    const visualWidth = WISP_BOUNDS.width * layoutScale;
    const visualHeight = WISP_BOUNDS.height * layoutScale;
    const visualLeft = (width - visualWidth) / 2;
    const visualTop = layout.boardTop - boardGap - visualHeight;
    const visualBottom = visualTop + visualHeight;

    this.wisp.scale.set(layoutScale);
    this.wisp.position.set(
      visualLeft - WISP_BOUNDS.x * layoutScale,
      visualBottom + WISP_BOUNDS.y * layoutScale,
    );
  }

  override end(): void {
    Game.events.onSpinRequestedEvent.unsubscribe(this.handleSpinRequest);
    Game.events.onSpinStateChangedEvent.unsubscribe(this.handleSpinStateChange);
    this.wisp?.parent?.removeChild(this.wisp);
    this.wisp?.destroy({ children: true });
    this.wisp = undefined;
  }

  private presentResult(): void {
    if (!this.wisp) return;

    if (!this.pendingWin) {
      this.wisp.state.setAnimation(0, "idle", true);
      return;
    }

    this.wisp.state.setAnimation(0, "skill", false);
    this.wisp.state.addAnimation(0, "idle", true, 0);
  }
}
