import type { Mode, Player, TAnyMove } from '../types/game';

/** init game config with the host */
export type TGameInitData = {
  type: 'game:init';
  payload: {
    mode: Mode;
    size: number;
    moves: TAnyMove[];
    currentPlayer: Player;
  };
};

export type TGameAddMoveData = {
  type: 'game:addMove';
  payload: {
    move: TAnyMove;
  };
};

export type TGameResetData = {
  type: 'game:reset';
  payload: {};
};

export type TConnectionGameData = TGameInitData | TGameAddMoveData | TGameResetData;

export const init = (
  mode: Mode,
  size: number,
  moves: TAnyMove[],
  currentPlayer: Player
): TGameInitData => ({
  type: 'game:init',
  payload: {
    mode,
    size,
    moves,
    currentPlayer
  }
});

export const addMove = (move: TAnyMove): TGameAddMoveData => ({
  type: 'game:addMove',
  payload: {
    move
  }
});

export const reset = (): TConnectionGameData => ({
  type: 'game:reset',
  payload: {}
});
