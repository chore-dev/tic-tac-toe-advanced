import type { Mode, TMove } from '../store/game';
import type { Player } from './../store/game';

/** init game config with the host */
type TGameInitData = {
  type: 'game:init';
  payload: {
    size: number;
    mode: Mode;
    moves: TMove[];
    currentPlayer: Player;
  };
};

type TGameAddMoveData = {
  type: 'game:addMove';
  payload: {
    move: TMove;
  };
};

type TGameResetData = {
  type: 'game:reset';
};

export type TConnectionGameData = TGameInitData | TGameAddMoveData | TGameResetData;

export const init = (
  size: number,
  mode: Mode,
  moves: TMove[],
  currentPlayer: Player
): TGameInitData => ({
  type: 'game:init',
  payload: {
    size,
    mode,
    moves,
    currentPlayer
  }
});

export const addMove = (move: TMove): TGameAddMoveData => ({
  type: 'game:addMove',
  payload: {
    move
  }
});

export const reset = (): TConnectionGameData => ({
  type: 'game:reset'
});
