import { Application } from "pixi.js";
import { gsap } from "gsap";
import { GameEvent } from "./GameEvent";
import { Scene } from "./GameScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { LoadingScene } from "../scenes/LoadingScene";
import { MainGameScene } from "../scenes/MainGameScene";
import { GameAssets } from "../configs/GameAssets";

const SOUND_ENABLED_STORAGE_KEY = "slot-sound-enabled";

type ResultSounds = {
  win?: HTMLAudioElement;
  lose?: HTMLAudioElement;
};

const getInitialSoundEnabled = (): boolean => {
  try {
    return window.localStorage.getItem(SOUND_ENABLED_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
};

export const GameScene = {
  PRELOAD: "PRELOAD",
  LOADING: "LOADING",
  MAIN_GAME: "MAIN_GAME",
} as const;

export type GameSceneKey = (typeof GameScene)[keyof typeof GameScene];

// This is intentionally a local prototype result. A production slot must
// receive an authoritative, validated outcome from its game server instead.
export type DemoSpinResult = {
  spinId: number;
  reelStops: number[];
};

type GAME_Type = {
  scenes: Record<GameSceneKey, Scene>;
  currentScene: Scene | undefined;
  events: {
    onWindowResizeEvent: GameEvent<void>;
    onSceneChangedEvent: GameEvent<GameSceneKey>;
    onSpinRequestedEvent: GameEvent<DemoSpinResult>;
    onSpinStateChangedEvent: GameEvent<boolean>;
  };
  soundEnabled: boolean;
  backgroundMusic: HTMLAudioElement | undefined;
  resultSounds: ResultSounds;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => boolean;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  preloadSoundEffects: () => void;
  playResultSound: (isWin: boolean) => void;
  requestDemoSpin: () => void;
  setScene: (sceneKey: GameSceneKey) => void;
  app: Application | undefined;
};

export const Game: GAME_Type = {
  scenes: {
    [GameScene.PRELOAD]: new PreloadScene(),
    [GameScene.LOADING]: new LoadingScene(),
    [GameScene.MAIN_GAME]: new MainGameScene(),
  },
  currentScene: undefined,
  events: {
    onWindowResizeEvent: new GameEvent<void>("OnWindowResize"),
    onSceneChangedEvent: new GameEvent<GameSceneKey>("OnSceneChanged"),
    onSpinRequestedEvent: new GameEvent<DemoSpinResult>("OnSpinRequested"),
    onSpinStateChangedEvent: new GameEvent<boolean>("OnSpinStateChanged"),
  },
  soundEnabled: getInitialSoundEnabled(),
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    try {
      window.localStorage.setItem(
        SOUND_ENABLED_STORAGE_KEY,
        String(this.soundEnabled),
      );
    } catch (error: any) {
      console.log("error with storage: " + error);
    }
    if (!enabled) this.stopBackgroundMusic();
  },
  toggleSound() {
    this.setSoundEnabled(!this.soundEnabled);
    return this.soundEnabled;
  },
  startBackgroundMusic() {
    if (!this.soundEnabled) return;

    if (!this.backgroundMusic) {
      const music = new Audio(GameAssets.BACKGROUND_MUSIC.url);
      music.loop = true;
      music.preload = "auto";
      music.volume = 0.35;
      this.backgroundMusic = music;
    }

    // Playback can be rejected when the browser does not consider the scene
    // selection a user gesture. Audio is optional, so keep the game running
    // and let the player enable it again from the in-game music control.
    void this.backgroundMusic.play().catch(() => undefined);
  },
  stopBackgroundMusic() {
    this.backgroundMusic?.pause();
  },
  preloadSoundEffects() {
    (["win", "lose"] as const).forEach((cue) => {
      if (this.resultSounds[cue]) return;

      const sound = new Audio(
        cue === "win" ? GameAssets.WIN_SOUND.url : GameAssets.LOSE_SOUND.url,
      );
      sound.preload = "auto";
      this.resultSounds[cue] = sound;
    });
  },
  playResultSound(isWin) {
    if (!this.soundEnabled) return;

    const cue = isWin ? "win" : "lose";
    this.preloadSoundEffects();
    const sound = this.resultSounds[cue]!;

    sound.volume = isWin ? 0.55 : 0.4;
    sound.currentTime = 0;
    this.resultSounds[cue] = sound;
    void sound.play().catch(() => undefined);
  },
  requestDemoSpin() {
    const reelStops = Array.from(
      { length: 3 },
      () => Math.floor(Math.random() * 3),
    );
    this.events.onSpinRequestedEvent.emit({
      spinId: Date.now(),
      reelStops,
    });
  },
  setScene(sceneKey) {
    const nextScene: Scene = this.scenes[sceneKey];

    const enterScene = () => {
      if (this.currentScene) this.currentScene.onExit();
      this.currentScene = nextScene;
      this.currentScene.onEnter();
      this.events.onSceneChangedEvent.emit(sceneKey);
      if (this.app) {
        gsap.to(this.app.stage, {
          alpha: 1,
          duration: 0.45,
          ease: "power2.out",
        });
      }
    };

    if (!this.app || !this.currentScene) {
      enterScene();
      return;
    }

    gsap.killTweensOf(this.app.stage);
    gsap.to(this.app.stage, {
      alpha: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: enterScene,
    });
  },
  app: undefined,
  backgroundMusic: undefined,
  resultSounds: {},
};
