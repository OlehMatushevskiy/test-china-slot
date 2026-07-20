export const SLOT_BOARD_DESIGN = {
  width: 768,
  height: 512,
  maxWidth: 1240,
} as const;

const PHONE_MAX_WIDTH = 560;

export type SlotBoardLayout = {
  isPhone: boolean;
  horizontalInset: number;
  topSafeArea: number;
  controlsSafeArea: number;
  boardScale: number;
  boardWidth: number;
  boardHeight: number;
  boardLeft: number;
  boardTop: number;
  boardBottom: number;
  boardCenterX: number;
};

export const getSlotBoardLayout = (
  width: number,
  height: number,
): SlotBoardLayout => {
  const isCompactViewport = width <= 560 || height <= 600;
  const isPhone = width <= PHONE_MAX_WIDTH;
  const horizontalInset = Math.max(isCompactViewport ? 12 : 24, width * 0.02);
  const topSafeArea = isCompactViewport
    ? Math.max(196, height * 0.24)
    : Math.max(188, height * 0.18);
  const controlsSafeArea = isCompactViewport
    ? Math.max(108, height * 0.18)
    : Math.max(150, height * 0.18);
  const maxBoardWidth = Math.min(
    width - horizontalInset * 2,
    SLOT_BOARD_DESIGN.maxWidth,
  );
  const maxBoardHeight = Math.max(0, height - topSafeArea - controlsSafeArea);
  const boardScale = Math.min(
    maxBoardWidth / SLOT_BOARD_DESIGN.width,
    maxBoardHeight / SLOT_BOARD_DESIGN.height,
  );
  const boardWidth = SLOT_BOARD_DESIGN.width * boardScale;
  const boardHeight = SLOT_BOARD_DESIGN.height * boardScale;
  const boardLeft = (width - boardWidth) / 2;
  const boardTop = topSafeArea;

  return {
    isPhone,
    horizontalInset,
    topSafeArea,
    controlsSafeArea,
    boardScale,
    boardWidth,
    boardHeight,
    boardLeft,
    boardTop,
    boardBottom: boardTop + boardHeight,
    boardCenterX: boardLeft + boardWidth / 2,
  };
};
