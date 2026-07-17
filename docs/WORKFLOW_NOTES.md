# Workflow notes

Keep theme changes centralized in `src/configs/GameAssets.ts`. New symbols should be added to `GameAssetsAlias`, `GameAssets`, and `gameAssets`, then positioned in `SlotBoardBlock`. Audio files must be declared in `src/assets.d.ts`, supported by the webpack asset rule, and started from a player interaction to satisfy browser autoplay rules. Run `npm run build` after asset or TypeScript changes.
