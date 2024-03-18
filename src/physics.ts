import type { Grain, GrainPosition, Matrix, MaybeGrain} from './sketch';

/**
 * Handle a single grain of sanding falling, determining where it will land.
 */
export const getNextPosition = (
  x: number,
  y: number,
  grainList: Matrix<Grain|null>,
  speed: number,
  canvasBottom: number,
  granularity: number,
  canMoveHorizontally: boolean,
): GrainPosition => {
  const grain = grainList[x][y] as Grain;

  let nextAvailableY = y + speed;
  let nextAvailableX = x;
  let stillFalling = true;

  if (nextAvailableY >= canvasBottom) {
    return {x, y: canvasBottom - granularity, falling: false};
  }

  for (let yPos = nextAvailableY; yPos > y; yPos--) {
    const atPos = grainList[x][yPos]
    if (atPos && !atPos.falling) {
      if (canMoveHorizontally) {
        const direction = Math.random() > 0.5;

        if (direction) {
          var selectedDirection = getNextPosition(x + 1, y, grainList, speed, canvasBottom, granularity, false);
        } else {
          var selectedDirection = getNextPosition(x - 1, y, grainList, speed, canvasBottom, granularity, false);
        }

        nextAvailableX = selectedDirection.x;
        stillFalling = selectedDirection.falling;
        break;
      }

      stillFalling = false
      nextAvailableY = yPos;
      break;
    }
  }
  
  return {
    x: nextAvailableX,
    y: nextAvailableY - granularity,
    falling: stillFalling,
  };
}