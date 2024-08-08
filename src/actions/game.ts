import type { TConnectionData } from '../helpers/peer';
import type { Mode, TMove } from '../store/game';
import type { Player } from './../store/game';

export const init = (
  size: number,
  mode: Mode,
  moves: TMove[],
  currentPlayer: Player
): TConnectionData => ({
  type: 'game:init',
  payload: {
    size,
    mode,
    moves,
    currentPlayer
  }
});

export const addMove = (move: TMove) => ({
  type: 'game:addMove',
  payload: {
    move
  }
});

export const reset = () => ({
  type: 'game:reset'
});
