// newLogic.ts
export const MAX_SPEED = 60; // Maximum move distance in pixels per click
export const RESET_POSITION = -600; // Height of road image (in pixels)

export const calculateMoveDistance = (clickCount: number): number => {
  const increment = MAX_SPEED * 0.01449; // 1.44% of max speed
  let newMoveDistance = increment * clickCount;

  return Math.min(newMoveDistance, MAX_SPEED);
};

export const animateRoad = (prevPosition: number, moveDistance: number, windowHeight: number): number => {
  if (prevPosition >= windowHeight) {
    return RESET_POSITION;
  }
  return prevPosition + moveDistance;
};
