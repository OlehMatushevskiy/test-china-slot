import type { Application } from "pixi.js";
import { gsap } from "gsap";
import type { Scene } from "./GameScene";
import { GameEvent } from "./GameEvent";

export const GameScene = {
  PRELOAD: "PRELOAD",
  LOADING: "LOADING",
  MAIN_GAME: "MAIN_GAME",
} as const;

export type GameSceneKey = (typeof GameScene)[keyof typeof GameScene];

export class SceneManager {
  private app?: Application;
  private currentScene?: Scene;
  private currentSceneKey?: GameSceneKey;
  private transition = Promise.resolve();
  private appGeneration = 0;

  readonly onSceneChanged = new GameEvent<GameSceneKey>("SceneChanged");

  constructor(private readonly scenes: Record<GameSceneKey, Scene>) {}

  attachApp(app: Application): void {
    this.app = app;
    this.appGeneration += 1;
  }

  detachApp(): void {
    this.appGeneration += 1;
    if (this.app) gsap.killTweensOf(this.app.stage);
    this.transition = Promise.resolve();
    this.currentScene?.onExit();
    this.currentScene = undefined;
    this.currentSceneKey = undefined;
    this.app = undefined;
  }

  getApp(): Application | undefined {
    return this.app;
  }

  getCurrentScene(): Scene | undefined {
    return this.currentScene;
  }

  isCurrentScene(sceneKey: GameSceneKey): boolean {
    return this.currentSceneKey === sceneKey;
  }

  setScene(sceneKey: GameSceneKey): Promise<void> {
    const requestedTransition = this.transition.then(() => this.transitionTo(sceneKey));
    this.transition = requestedTransition.catch(() => undefined);
    return requestedTransition;
  }

  private async transitionTo(sceneKey: GameSceneKey): Promise<void> {
    const nextScene = this.scenes[sceneKey];
    const app = this.app;
    const appGeneration = this.appGeneration;

    if (this.currentScene) {
      if (app) {
        await this.fadeStage(app, 0, 0.25, "power2.in");
        if (!this.isCurrentApp(app, appGeneration)) return;
      }
      await this.currentScene.onExit();
      if (app && !this.isCurrentApp(app, appGeneration)) return;
    }

    this.currentScene = nextScene;
    this.currentSceneKey = sceneKey;
    await this.currentScene.onEnter();
    if (app && !this.isCurrentApp(app, appGeneration)) return;
    this.onSceneChanged.emit(sceneKey);

    if (app && this.app === app) {
      await this.fadeStage(app, 1, 0.45, "power2.out");
    }
  }

  private isCurrentApp(app: Application, appGeneration: number): boolean {
    return this.app === app && this.appGeneration === appGeneration;
  }

  private fadeStage(
    app: Application,
    alpha: number,
    duration: number,
    ease: string,
  ): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(app.stage, {
        alpha,
        duration,
        ease,
        onComplete: resolve,
        onInterrupt: resolve,
      });
    });
  }
}
