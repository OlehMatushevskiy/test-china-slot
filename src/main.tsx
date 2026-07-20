import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import PixiCanvas from './pixi/PixiCanvas';
import SlotControls from './components/SlotControls';
import { PaylineInfo } from './components/PaylineInfo';
import { SpinResultBanner } from './components/SpinResultBanner';
import { ZeroBalanceFrame } from './components/ZeroBalanceFrame';
import { GameProvider, useGame } from './core/GameContext';
import { GameScene } from './core/SceneManager';

function GameApp() {
  const game = useGame();
  const { sceneManager } = game;
  const [isMainGameVisible, setIsMainGameVisible] = useState(
    sceneManager.isCurrentScene(GameScene.MAIN_GAME),
  );

  useEffect(() => {
    const handleSceneChange = (scene: typeof GameScene[keyof typeof GameScene]) => {
      setIsMainGameVisible(scene === GameScene.MAIN_GAME);
    };

    sceneManager.onSceneChanged.subscribe(handleSceneChange);
    return () => sceneManager.onSceneChanged.unsubscribe(handleSceneChange);
  }, []);

  return <main className="game-shell relative bg-slate-900">
    <div className="absolute inset-0 z-0">
      <PixiCanvas game={game} />
    </div>
    {isMainGameVisible && <>
      <PaylineInfo />
      <SpinResultBanner />
      <ZeroBalanceFrame />
      <SlotControls />
    </>}
  </main>
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
