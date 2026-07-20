import { createContext, useContext, useState, type ReactNode } from "react";
import { createGame, type GameInstance } from "./Game";

const GameContext = createContext<GameInstance | null>(null);

type GameProviderProps = {
  children: ReactNode;
  game?: GameInstance;
};

export function GameProvider({ children, game }: GameProviderProps) {
  const [instance] = useState(() => game ?? createGame());

  return <GameContext.Provider value={instance}>{children}</GameContext.Provider>;
}

export function useGame(): GameInstance {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error("Game components must be rendered inside GameProvider.");
  }

  return game;
}
