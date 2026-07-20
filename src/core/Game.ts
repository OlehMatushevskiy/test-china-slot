import { Application } from "pixi.js";
import { gsap } from "gsap";
import { GameEvent } from "./GameEvent";
import { Scene } from "./GameScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { LoadingScene } from "../scenes/LoadingScene";
import { MainGameScene } from "../scenes/MainGameScene";
import { GameAssets } from "../configs/GameAssets";

const SOUND_ENABLED_STORAGE_KEY = "slot-sound-enabled";
export const SLOT_MIN_BET = 10;
export const SLOT_BET_STEP = 10;
const INITIAL_BALANCE = 1_000;
const RESULT_PRESENTATION_DURATION_MS = 1_100;
const REDUCED_MOTION_RESULT_DURATION_MS = 600;

const WIN_MULTIPLIERS = [3, 2, 5] as const;

let nextDemoSpinId = 0;

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

export type DemoSpinResult = {
  spinId: number;
  reelStops: number[];
  bet: number;
  winAmount: number;
  balance: number;
};

type DemoSpinRequest = {
  spinId: number;
  bet: number;
  balance: number;
};

export type SlotPhase =
  | "idle"
  | "requesting"
  | "spinning"
  | "presentingWin"
  | "presentingLoss";

export type SlotState = {
  phase: SlotPhase;
  bet: number;
  balance: number;
  spinId?: number;
  result?: DemoSpinResult;
};

export const requestMockSpinResult = (
  request: DemoSpinRequest,
): Promise<DemoSpinResult> => {
  const reelStops = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * WIN_MULTIPLIERS.length),
  );
  const isWin = reelStops.every((symbol) => symbol === reelStops[0]);
  const winAmount = isWin ? request.bet * WIN_MULTIPLIERS[reelStops[0]] : 0;

  return Promise.resolve({
    spinId: request.spinId,
    reelStops,
    bet: request.bet,
    winAmount,
    balance: request.balance - request.bet + winAmount,
  });
};

type GAME_Type = {
  scenes: Record<GameSceneKey, Scene>;
  currentScene: Scene | undefined;
  events: {
    onWindowResizeEvent: GameEvent<void>;
    onSceneChangedEvent: GameEvent<GameSceneKey>;
    onSpinRequestedEvent: GameEvent<DemoSpinResult>;
    onSpinStateChangedEvent: GameEvent<boolean>;
    onSlotStateChangedEvent: GameEvent<SlotState>;
  };
  slotState: SlotState;
  soundEnabled: boolean;
  backgroundMusic: HTMLAudioElement | undefined;
  resultSounds: ResultSounds;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => boolean;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  preloadSoundEffects: () => void;
  playResultSound: (isWin: boolean) => void;
  setSlotState: (state: SlotState) => void;
  adjustBet: (amount: number) => void;
  requestDemoSpin: () => boolean;
  presentSpinResult: (result: DemoSpinResult) => void;
  cancelActiveSpin: () => void;
  setScene: (sceneKey: GameSceneKey) => void;
  app: Application | undefined;
  resultPresentationTimeout: number | undefined;
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
    onSlotStateChangedEvent: new GameEvent<SlotState>("OnSlotStateChanged"),
  },
  slotState: {
    phase: "idle",
    bet: SLOT_MIN_BET,
    balance: INITIAL_BALANCE,
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
      music.volume = 0.3;
      this.backgroundMusic = music;
    }

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

    sound.volume = isWin ? 0.62 : 0.47;
    sound.currentTime = 0;
    this.resultSounds[cue] = sound;
    void sound.play().catch(() => undefined);
  },
  setSlotState(state) {
    this.slotState = state;
    this.events.onSlotStateChangedEvent.emit(state);
  },
  adjustBet(amount) {
    const state = this.slotState;
    if (state.phase !== "idle") return;

    const bet = Math.max(
      SLOT_MIN_BET,
      Math.min(state.balance, state.bet + amount),
    );
    if (bet === state.bet) return;

    this.setSlotState({ ...state, bet });
  },
  requestDemoSpin() {
    const state = this.slotState;
    if (state.phase !== "idle" || state.balance < state.bet) return false;

    const spinId = ++nextDemoSpinId;
    this.setSlotState({
      ...state,
      phase: "requesting",
      spinId,
      result: undefined,
    });

    void requestMockSpinResult({
      spinId,
      bet: state.bet,
      balance: state.balance,
    })
      .then((result) => {
        if (
          this.slotState.phase !== "requesting" ||
          this.slotState.spinId !== result.spinId
        ) {
          return;
        }

        this.setSlotState({
          ...this.slotState,
          phase: "spinning",
          balance: result.balance,
          result,
        });
        this.events.onSpinRequestedEvent.emit(result);
      })
      .catch(() => {
        if (
          this.slotState.phase === "requesting" &&
          this.slotState.spinId === spinId
        ) {
          this.setSlotState({
            ...this.slotState,
            phase: "idle",
            spinId: undefined,
          });
        }
      });

    return true;
  },
  presentSpinResult(result) {
    if (
      this.slotState.phase !== "spinning" ||
      this.slotState.spinId !== result.spinId
    ) {
      return;
    }

    if (this.resultPresentationTimeout !== undefined) {
      window.clearTimeout(this.resultPresentationTimeout);
    }

    this.setSlotState({
      ...this.slotState,
      phase: result.winAmount > 0 ? "presentingWin" : "presentingLoss",
      result,
    });

    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? REDUCED_MOTION_RESULT_DURATION_MS
      : RESULT_PRESENTATION_DURATION_MS;
    this.resultPresentationTimeout = window.setTimeout(() => {
      if (this.slotState.spinId !== result.spinId) return;
      this.setSlotState({
        ...this.slotState,
        phase: "idle",
        spinId: undefined,
      });
      this.resultPresentationTimeout = undefined;
    }, duration);
  },
  cancelActiveSpin() {
    if (this.resultPresentationTimeout !== undefined) {
      window.clearTimeout(this.resultPresentationTimeout);
      this.resultPresentationTimeout = undefined;
    }

    if (this.slotState.phase === "idle") return;
    this.setSlotState({
      ...this.slotState,
      phase: "idle",
      spinId: undefined,
      result: undefined,
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
  resultPresentationTimeout: undefined,
};
