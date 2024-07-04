import type { TConnectionData } from '../helpers/peer';
import type { Mode, TMove, TPosition } from '../store/game';
import type { TPlayer } from './../store/game';

export const init = (
  size: number,
  mode: Mode,
  moves: TMove[],
  currentPlayer: TPlayer
): TConnectionData => ({
  type: 'game:init',
  payload: {
    size,
    mode,
    moves,
    currentPlayer
  }
});

export const move = (position: TPosition, player: TPlayer) => ({
  type: 'game:move',
  payload: {
    position,
    player
  }
});

export const reset = () => ({
  type: 'game:reset'
});
