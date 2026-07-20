import backgroundUrl from "../../assets/chinese-slot-background.webp";
import boardUrl from "../../assets/chinese-slot-board-transparent.webp";
import dragonSymbolUrl from "../../assets/symbol-lucky-dragon.webp";
import lanternSymbolUrl from "../../assets/symbol-red-lantern.webp";
import ingotSymbolUrl from "../../assets/symbol-golden-ingot.webp";
import backgroundMusicUrl from "../../audio/background-music.mp3";
import winSoundUrl from "../../audio/win.mp3";
import loseSoundUrl from "../../audio/lose.mp3";
import wispAtlasUrl from "../../assets/spine_1/azure.atlas";
import wispDataUrl from "../../assets/spine_1/azure.json";

export const GameAssetsAlias = {
  BACKGROUND: backgroundUrl,
  SLOT_BOARD: boardUrl,
  SYMBOL_DRAGON: dragonSymbolUrl,
  SYMBOL_LANTERN: lanternSymbolUrl,
  SYMBOL_INGOT: ingotSymbolUrl,
  BACKGROUND_MUSIC: backgroundMusicUrl,
  WIN_SOUND: winSoundUrl,
  LOSE_SOUND: loseSoundUrl,
  WISP_DATA: "wisp-data",
  WISP_ATLAS: "wisp-atlas",
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
  WISP_DATA: {
    alias: GameAssetsAlias.WISP_DATA,
    url: wispDataUrl,
  },
  WISP_ATLAS: {
    alias: GameAssetsAlias.WISP_ATLAS,
    url: wispAtlasUrl,
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
    alias: GameAssetsAlias.WISP_DATA,
    src: wispDataUrl,
  },
  {
    alias: GameAssetsAlias.WISP_ATLAS,
    src: wispAtlasUrl,
  },
];
