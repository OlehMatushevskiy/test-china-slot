import { useSyncExternalStore } from "react";
import type { SlotEngine } from "../core/SlotEngine";

const subscribe = (
  slotEngine: SlotEngine,
  onStoreChange: () => void,
): (() => void) => {
  slotEngine.onStateChanged.subscribe(onStoreChange);

  return () => slotEngine.onStateChanged.unsubscribe(onStoreChange);
};

export const useSlotState = (slotEngine: SlotEngine) =>
  useSyncExternalStore(
    (onStoreChange) => subscribe(slotEngine, onStoreChange),
    () => slotEngine.getState(),
    () => slotEngine.getState(),
  );
