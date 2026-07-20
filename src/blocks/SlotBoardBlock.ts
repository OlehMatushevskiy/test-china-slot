import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { Block } from "../core/Block";
import { DemoSpinResult, Game } from "../core/Game";
import { GameAssetsAlias } from "../configs/GameAssets";
import { getSlotBoardLayout } from "../configs/GameLayout";

type TileLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Reel = {
  strip: Container;
  symbols: Sprite[];
  textureIndexes: number[];
  incomingTextureIndexes: number[];
  tile: TileLayout;
  baseY: number;
  symbolStep: number;
};

const REEL_SYMBOL_SCALE = 0.27;
const REEL_ROLL_DURATION = 0.1;

export class SlotBoardBlock extends Block {
  private readonly container = new Container();
  private readonly symbolLayer = new Container();
  private readonly reelMask = new Graphics();
  private board?: Sprite;
  private reels: Reel[] = [];
  private spinTimeline?: gsap.core.Timeline;
  private isSpinning = false;
  private readonly reelTextureAliases = [
    GameAssetsAlias.SYMBOL_DRAGON,
    GameAssetsAlias.SYMBOL_LANTERN,
    GameAssetsAlias.SYMBOL_INGOT,
  ];
  private readonly handleSpinRequest = (result: DemoSpinResult): void =>
    this.spin(result);

  private readonly tileLayouts: TileLayout[] = [
    { x: 244 / 1536, y: 319 / 1024, width: 316 / 1536, height: 486 / 1024 },
    { x: 598 / 1536, y: 319 / 1024, width: 340 / 1536, height: 486 / 1024 },
    { x: 978 / 1536, y: 319 / 1024, width: 314 / 1536, height: 486 / 1024 },
  ];

  start(): void {
    const boardTexture = Assets.get<Texture>(GameAssetsAlias.SLOT_BOARD);
    this.board = new Sprite(boardTexture);
    this.board.anchor.set(0.5);
    this.container.addChild(this.board);

    this.reels = this.tileLayouts.map((tile, reelIndex) =>
      this.createReel(tile, reelIndex),
    );
    this.symbolLayer.mask = this.reelMask;
    this.container.addChild(this.symbolLayer, this.reelMask);

    Game.app?.stage.addChild(this.container);
    Game.events.onSpinRequestedEvent.subscribe(this.handleSpinRequest);
    this.resize();
  }

  resize(): void {
    const app = Game.app;
    if (!app || !this.board) return;

    const boardTexture = this.board.texture;
    const layout = getSlotBoardLayout(app.screen.width, app.screen.height);
    const boardScale = layout.boardScale;

    this.container.position.set(
      layout.boardCenterX,
      layout.boardTop + (boardTexture.orig.height * boardScale) / 2,
    );
    this.board.scale.set(boardScale);

    this.reels.forEach((reel) => {
      const tileCenterX =
        (reel.tile.x + reel.tile.width / 2 - 0.5) *
        boardTexture.orig.width *
        boardScale;
      const tileCenterY =
        (reel.tile.y + reel.tile.height / 2 - 0.5) *
        boardTexture.orig.height *
        boardScale;

      reel.baseY = tileCenterY;
      reel.symbolStep =
        reel.tile.height * boardTexture.orig.height * boardScale;
      reel.strip.position.set(tileCenterX, tileCenterY);
      reel.symbols.forEach((symbol, symbolIndex) => {
        symbol.y = (symbolIndex - 1) * reel.symbolStep;
        symbol.scale.set(REEL_SYMBOL_SCALE * boardScale);
      });
    });

    this.drawReelMask(boardTexture, boardScale);
  }

  end(): void {
    this.spinTimeline?.kill();
    this.spinTimeline = undefined;
    this.isSpinning = false;
    Game.events.onSpinRequestedEvent.unsubscribe(this.handleSpinRequest);
    Game.cancelActiveSpin();
    Game.events.onSpinStateChangedEvent.emit(false);
    this.container.parent?.removeChild(this.container);

    this.symbolLayer.mask = null;
    this.reels.forEach((reel) => {
      reel.incomingTextureIndexes = [];
      reel.textureIndexes = [];
      reel.symbols = [];
    });
    this.container.destroy({ children: true });
    this.board = undefined;
    this.reels = [];
  }

  private createReel(tile: TileLayout, initialCenterIndex: number): Reel {
    const strip = new Container();
    const symbols = [-1, 0, 1].map(() => {
      const symbol = new Sprite();
      symbol.anchor.set(0.5);
      strip.addChild(symbol);
      return symbol;
    });

    const reel: Reel = {
      strip,
      symbols,
      textureIndexes: [],
      incomingTextureIndexes: [],
      tile,
      baseY: 0,
      symbolStep: 0,
    };

    this.setReelCenter(reel, initialCenterIndex);
    this.symbolLayer.addChild(strip);
    return reel;
  }

  private spin(result: DemoSpinResult): void {
    if (this.isSpinning || this.reels.length === 0) return;

    const finalSymbolIndexes = result.reelStops;
    this.isSpinning = true;
    Game.events.onSpinStateChangedEvent.emit(true);
    this.spinTimeline?.kill();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.spinTimeline = gsap.timeline({
      onComplete: () => {
        this.isSpinning = false;
        this.spinTimeline = undefined;
        Game.playResultSound(result.winAmount > 0);
        Game.presentSpinResult(result);
        Game.events.onSpinStateChangedEvent.emit(false);
      },
    });

    this.reels.forEach((reel, reelIndex) => {
      const cycles = reduceMotion ? 3 + reelIndex : 19 + reelIndex * 3;
      const finalIndex = finalSymbolIndexes[reelIndex];
      const startAt = 0;
      const rollingTime = cycles * REEL_ROLL_DURATION;

      this.prepareReelSpin(reel, finalIndex, cycles);
      reel.strip.y = reel.baseY;

      this.spinTimeline!.to(
        reel.strip,
        {
          y: reel.baseY + reel.symbolStep,
          duration: REEL_ROLL_DURATION,
          repeat: cycles - 1,
          ease: "none",
          overwrite: "auto",
          onRepeat: () => this.advanceReel(reel),
        },
        startAt,
      )
        .set(reel.strip, { y: reel.baseY }, startAt + rollingTime)
        .call(() => this.advanceReel(reel), undefined, startAt + rollingTime)
        .to(
          reel.strip,
          {
            y: reel.baseY + reel.symbolStep * 0.055,
            duration: 0.1,
            ease: "power2.out",
          },
          startAt + rollingTime,
        )
        .to(
          reel.strip,
          {
            y: reel.baseY,
            duration: reduceMotion ? 0.08 : 0.34,
            ease: reduceMotion ? "power1.out" : "elastic.out(1, 0.45)",
          },
          startAt + rollingTime + 0.1,
        );
    });
  }

  private setReelCenter(reel: Reel, centerIndex: number): void {
    const textureCount = this.reelTextureAliases.length;
    reel.textureIndexes = [
      (centerIndex - 1 + textureCount) % textureCount,
      centerIndex,
      (centerIndex + 1) % textureCount,
    ];
    this.applyReelTextures(reel);
  }

  private advanceReel(reel: Reel): void {
    const [topIndex, centerIndex] = reel.textureIndexes;
    const nextTopIndex =
      reel.incomingTextureIndexes.shift() ?? this.getRandomSymbolIndex();
    reel.textureIndexes = [nextTopIndex, topIndex, centerIndex];
    this.applyReelTextures(reel);
  }

  private prepareReelSpin(
    reel: Reel,
    finalIndex: number,
    cycles: number,
  ): void {
    const textureIndexes = Array.from({ length: 3 }, () =>
      this.getRandomSymbolIndex(),
    );
    const incomingTextureIndexes = Array.from({ length: cycles }, () =>
      this.getRandomSymbolIndex(),
    );

    if (cycles === 1) {
      textureIndexes[0] = finalIndex;
    } else {
      incomingTextureIndexes[cycles - 2] = finalIndex;
    }

    reel.textureIndexes = textureIndexes;
    reel.incomingTextureIndexes = incomingTextureIndexes;
    this.applyReelTextures(reel);
  }

  private getRandomSymbolIndex(): number {
    return Math.floor(Math.random() * this.reelTextureAliases.length);
  }

  private applyReelTextures(reel: Reel): void {
    reel.symbols.forEach((symbol, index) => {
      symbol.texture = Assets.get<Texture>(
        this.reelTextureAliases[reel.textureIndexes[index]],
      );
    });
  }

  private drawReelMask(boardTexture: Texture, boardScale: number): void {
    this.reelMask.clear();
    this.tileLayouts.forEach((tile) => {
      const x = (tile.x - 0.5) * boardTexture.orig.width * boardScale;
      const y = (tile.y - 0.5) * boardTexture.orig.height * boardScale;
      this.reelMask.roundRect(
        x,
        y,
        tile.width * boardTexture.orig.width * boardScale,
        tile.height * boardTexture.orig.height * boardScale,
        Math.min(boardTexture.orig.width, boardTexture.orig.height) *
          (22 / 1024) *
          boardScale,
      );
    });
    this.reelMask.fill({ color: 0xffffff });
  }
}
