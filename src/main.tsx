import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import PixiCanvas from './pixi/PixiCanvas';
import SlotControls from './components/SlotControls';
import { PaylineInfo } from './components/PaylineInfo';
import { Game, GameScene } from './core/Game';

function App() {
  const [isMainGameVisible, setIsMainGameVisible] = useState(
    Game.currentScene === Game.scenes[GameScene.MAIN_GAME],
  );

  useEffect(() => {
    const handleSceneChange = (scene: typeof GameScene[keyof typeof GameScene]) => {
      setIsMainGameVisible(scene === GameScene.MAIN_GAME);
    };

    Game.events.onSceneChangedEvent.subscribe(handleSceneChange);
    return () => Game.events.onSceneChangedEvent.unsubscribe(handleSceneChange);
  }, []);

  return <main className="game-shell relative bg-slate-900">
    <div className="absolute inset-0 z-0">
      <PixiCanvas />
    </div>
    {isMainGameVisible && <>
      <PaylineInfo />
      <SlotControls />
    </>}
  </main>
}

createRoot(document.getElementById('root')!).render(<App />);
