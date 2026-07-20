import { GameAssets } from "../configs/GameAssets";

const STORAGE_KEY = "slot-sound-enabled";

export class AudioManager {
  private backgroundMusic?: HTMLAudioElement;
  private resultSounds: Partial<Record<"win" | "lose", HTMLAudioElement>> = {};

  private soundEnabled = this.readInitialEnabled();

  isEnabled(): boolean {
    return this.soundEnabled;
  }

  setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;

    try {
      window.localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      console.log("Error with saving to localStorage");
    }

    if (!enabled) this.stopBackgroundMusic();
  }

  toggle(): boolean {
    this.setEnabled(!this.soundEnabled);
    return this.soundEnabled;
  }

  startBackgroundMusic(): void {
    if (!this.soundEnabled) return;

    if (!this.backgroundMusic) {
      const music = new Audio(GameAssets.BACKGROUND_MUSIC.url);
      music.loop = true;
      music.preload = "auto";
      music.volume = 0.3;
      this.backgroundMusic = music;
    }

    void this.backgroundMusic.play().catch(() => undefined);
  }

  stopBackgroundMusic(): void {
    this.backgroundMusic?.pause();
  }

  playResult(isWin: boolean): void {
    if (!this.soundEnabled) return;

    const cue = isWin ? "win" : "lose";
    const sound = this.getResultSound(cue);

    sound.currentTime = 0;
    sound.volume = isWin ? 0.62 : 0.47;
    void sound.play().catch(() => undefined);
  }

  dispose(): void {
    this.stopBackgroundMusic();
    this.backgroundMusic?.removeAttribute("src");
    this.backgroundMusic?.load();
    Object.values(this.resultSounds).forEach((sound) => {
      sound?.removeAttribute("src");
      sound?.load();
    });
    this.backgroundMusic = undefined;
    this.resultSounds = {};
  }

  private getResultSound(cue: "win" | "lose"): HTMLAudioElement {
    const existing = this.resultSounds[cue];
    if (existing) return existing;

    const sound = new Audio(
      cue === "win" ? GameAssets.WIN_SOUND.url : GameAssets.LOSE_SOUND.url,
    );
    sound.preload = "auto";
    this.resultSounds[cue] = sound;
    return sound;
  }

  private readInitialEnabled(): boolean {
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
      return true;
    }
  }
}
