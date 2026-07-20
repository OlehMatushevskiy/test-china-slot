import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import type { GameInstance } from "../core/Game";
import { GameScene } from "../core/SceneManager";

type PixiCanvasProps = {
    game: GameInstance;
};

const PixiCanvas = ({ game }: PixiCanvasProps) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const appRef = useRef<Application | null>(null);

    useEffect(() => {

        const canvas = canvasRef.current;

        if(!canvas) { return; }

        let initialized = false;
        let disposed = false;

        const app = new Application();
        let emitResize: (() => void) | undefined;
        
        appRef.current = app;

        void document.fonts.load('22px "Cinzel Decorative"').then(() => app.init({
            resizeTo: window,
            canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true,
            background: 0x170f2c
        })).then(() => {

            if (disposed) {
                app.destroy(true);
                return;
            }

            initialized = true;

            game.sceneManager.attachApp(app);

            emitResize = () => {
                game.onWindowResize.emit();
            }

            void game.sceneManager.setScene(GameScene.PRELOAD);
            
            app.renderer.on("resize", emitResize);

        }).catch((error: unknown) => {
             console.error("Failed to initialize Pixi application", error);
        });

        return () => {
            disposed = true;
            if (emitResize) app.renderer.off("resize", emitResize);
            if (initialized) {
                game.sceneManager.detachApp();
                game.slotPresentationController.cancel();
                game.audioManager.dispose();
                app.destroy(true);
            }
            appRef.current = null;
        };
    },[game]);
    
    return <canvas ref={canvasRef} className="pixi-canvas" />;
};

export default PixiCanvas;
