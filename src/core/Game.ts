import { AudioManager } from "./AudioManager";
import { GameEvent } from "./GameEvent";
import { MockSpinResultProvider } from "./MockResultProvider";
import { GameScene, SceneManager, type GameSceneKey } from "./SceneManager";
import { SlotEngine } from "./SlotEngine";
import { SlotPresentationController } from "./SlotPresentationController";
import type { SceneDependencies } from "./GameScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { LoadingScene } from "../scenes/LoadingScene";
import { MainGameScene } from "../scenes/MainGameScene";

export type GameInstance = {
  audioManager: AudioManager;
  onWindowResize: GameEvent<void>;
  sceneManager: SceneManager;
  slotEngine: SlotEngine;
  slotPresentationController: SlotPresentationController;
};

export function createGame(): GameInstance {
  const onWindowResize = new GameEvent<void>("WindowResize");
  const audioManager = new AudioManager();
  const slotEngine = new SlotEngine(new MockSpinResultProvider());
  const slotPresentationController = new SlotPresentationController(
    slotEngine,
    audioManager,
  );

  let sceneManager: SceneManager;
  const sceneDependencies: SceneDependencies = {
    getApp: () => sceneManager.getApp(),
    onWindowResize,
  };
  const setScene = (scene: GameSceneKey): void => {
    void sceneManager.setScene(scene);
  };

  sceneManager = new SceneManager({
    [GameScene.PRELOAD]: new PreloadScene(sceneDependencies, audioManager, () =>
      setScene(GameScene.LOADING),
    ),
    [GameScene.LOADING]: new LoadingScene(sceneDependencies, () =>
      setScene(GameScene.MAIN_GAME),
    ),
    [GameScene.MAIN_GAME]: new MainGameScene(
      sceneDependencies,
      slotEngine,
      slotPresentationController,
      audioManager,
    ),
  });

  return {
    audioManager,
    onWindowResize,
    sceneManager,
    slotEngine,
    slotPresentationController,
  };
}
