import type { TConnectionData } from '../helpers/peer';
import type { Mode, TMove, TPosition } from '../store/game';
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

export const move = (position: TPosition, player: Player) => ({
  type: 'game:move',
  payload: {
    position,
    player
  }
});

export const reset = () => ({
  type: 'game:reset'
});
