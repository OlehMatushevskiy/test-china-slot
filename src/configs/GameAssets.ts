import backgroundUrl from "../../assets/chinese-slot-background.png";
import boardUrl from "../../assets/chinese-slot-board-transparent.png";
import dragonSymbolUrl from "../../assets/symbol-lucky-dragon.png";
import lanternSymbolUrl from "../../assets/symbol-red-lantern.png";
import ingotSymbolUrl from "../../assets/symbol-golden-ingot.png";
import minusButtonUrl from "../../assets/minus-button-centered.png";
import plusButtonUrl from "../../assets/plus-button-matched.png";
import spinButtonUrl from "../../assets/spin-button-centered.png";
import backgroundMusicUrl from "../../audio/background-music.mp3";
import winSoundUrl from "../../audio/win.mp3";
import loseSoundUrl from "../../audio/lose.mp3";
import dragonSkelUrl from "../../assets/spine/dragon-ess.skel";
import dragonAtlasUrl from "../../assets/spine/dragon-ess.atlas";

export const GameAssetsAlias = {
  BACKGROUND: backgroundUrl,
  SLOT_BOARD: boardUrl,
  SYMBOL_DRAGON: dragonSymbolUrl,
  SYMBOL_LANTERN: lanternSymbolUrl,
  SYMBOL_INGOT: ingotSymbolUrl,
  MINUS_BUTTON: minusButtonUrl,
  PLUS_BUTTON: plusButtonUrl,
  SPIN_BUTTON: spinButtonUrl,
  BACKGROUND_MUSIC: backgroundMusicUrl,
  WIN_SOUND: winSoundUrl,
  LOSE_SOUND: loseSoundUrl,
  DRAGON_DATA: "dragon-data",
  DRAGON_ATLAS: "dragon-atlas",
} as const;

export const GameAssets = {
  BACKGROUND: {
    alias: GameAssetsAlias.BACKGROUND,
    url: backgroundUrl,
  },
  SLOT_BOARD: {
    alias: GameAssetsAlias.SLOT_BOARD,
    url: boardUrl,
  },
  SYMBOL_DRAGON: {
    alias: GameAssetsAlias.SYMBOL_DRAGON,
    url: dragonSymbolUrl,
  },
  SYMBOL_LANTERN: {
    alias: GameAssetsAlias.SYMBOL_LANTERN,
    url: lanternSymbolUrl,
  },
  SYMBOL_INGOT: {
    alias: GameAssetsAlias.SYMBOL_INGOT,
    url: ingotSymbolUrl,
  },
  MINUS_BUTTON: {
    alias: GameAssetsAlias.MINUS_BUTTON,
    url: minusButtonUrl,
  },
  PLUS_BUTTON: {
    alias: GameAssetsAlias.PLUS_BUTTON,
    url: plusButtonUrl,
  },
  SPIN_BUTTON: {
    alias: GameAssetsAlias.SPIN_BUTTON,
    url: spinButtonUrl,
  },
  BACKGROUND_MUSIC: {
    alias: GameAssetsAlias.BACKGROUND_MUSIC,
    url: backgroundMusicUrl,
  },
  WIN_SOUND: {
    alias: GameAssetsAlias.WIN_SOUND,
    url: winSoundUrl,
  },
  LOSE_SOUND: {
    alias: GameAssetsAlias.LOSE_SOUND,
    url: loseSoundUrl,
  },
  DRAGON_DATA: {
    alias: GameAssetsAlias.DRAGON_DATA,
    url: dragonSkelUrl,
  },
  DRAGON_ATLAS: {
    alias: GameAssetsAlias.DRAGON_ATLAS,
    url: dragonAtlasUrl,
  },
} as const;

export const gameAssets = [
  {
    alias: GameAssetsAlias.BACKGROUND,
    src: backgroundUrl,
  },
  {
    alias: GameAssetsAlias.SLOT_BOARD,
    src: boardUrl,
  },
  {
    alias: GameAssetsAlias.SYMBOL_DRAGON,
    src: dragonSymbolUrl,
  },
  {
    alias: GameAssetsAlias.SYMBOL_LANTERN,
    src: lanternSymbolUrl,
  },
  {
    alias: GameAssetsAlias.SYMBOL_INGOT,
    src: ingotSymbolUrl,
  },
  {
    alias: GameAssetsAlias.MINUS_BUTTON,
    src: minusButtonUrl,
  },
  {
    alias: GameAssetsAlias.PLUS_BUTTON,
    src: plusButtonUrl,
  },
  {
    alias: GameAssetsAlias.SPIN_BUTTON,
    src: spinButtonUrl,
  },
  {
    alias: GameAssetsAlias.DRAGON_DATA,
    src: dragonSkelUrl,
  },
  {
    alias: GameAssetsAlias.DRAGON_ATLAS,
    src: dragonAtlasUrl,
  },
];
