export const SLOT_CONFIG = {
  initialBalance: 1_000,
  minBet: 10,
  betStep: 10,
  reelCount: 3,
  symbolCount: 3,
  winMultipliers: [3, 2, 5],
  resultPresentationDurationMs: 1_100,
  reducedMotionResultPresentationDurationMs: 600,
} as const;
