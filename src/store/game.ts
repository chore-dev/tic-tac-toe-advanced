import { signal } from '@preact/signals-react';

import { isPlayerSuccess, mapMovesToBoard } from '../helpers/game';

export enum Mode {
  Classic,
  Infinite,
  CoverUp
}

export enum Player {
  /** host/first player */
  O = 'O',
  X = 'X'
}

export enum InfiniteMoveStatus {
  None,
  RemovingSoon,
  Removed
}

export enum CoverUpSize {
  Small,
  Medium,
  Large
}

export type TPosition = [x: number, y: number];
type TMoveMetaBase = {
  id: number;
};
type TClassicModeMoveMeta = {
  mode: Mode.Classic;
};
export type TInfiniteModeMoveMeta = {
  mode: Mode.Infinite;
  status: InfiniteMoveStatus;
};
export type TCoverUpModeMoveMeta = {
  mode: Mode.CoverUp;
  size: CoverUpSize;
  from?: number;
};
type TMoveMeta = TClassicModeMoveMeta | TInfiniteModeMoveMeta | TCoverUpModeMoveMeta;
export type TBaseMove = [player: Player, position: TPosition, meta: TMoveMeta];
export type TMove = [player: Player, position: TPosition, meta: TMoveMetaBase & TMoveMeta];
export type TWinner = Player | 'DRAW' | null;

export const size = signal(3);

export const mode = signal(Mode.Classic);

export const moves = signal<TMove[]>([]);

export const currentPlayer = signal(Player.O);

export const winner = signal<TWinner>(null);

/**
 * @returns the move with id added to the meta
 */
export const addMove = (move: TBaseMove) => {
  const [player, position, meta] = move;
  const _move: TMove = [
    player,
    position,
    {
      ...meta,
      id: moves.value.length + 1
    }
  ];
  moves.value = [...moves.value, _move];
  // check winner
  const _winner = check();
  if (!_winner) {
    postAddMove();
    togglePlayer();
  } else {
    winner.value = _winner;
  }
  return _move;
};

const postAddMove = () => {
  switch (mode.value) {
    case Mode.Classic: {
      break;
    }
    case Mode.CoverUp: {
      break;
    }
    case Mode.Infinite: {
      if (moves.value.length >= size.value * size.value - size.value) {
        // mark the oldest move as `RemovingSoon`
        for (const [, , meta] of moves.value) {
          if (meta.mode === mode.value) {
            if (meta.status === InfiniteMoveStatus.None) {
              meta.status = InfiniteMoveStatus.RemovingSoon;
              break;
            }
          }
        }
      }
      if (moves.value.length >= size.value * size.value - size.value + 1) {
        // remove the move marked as `RemovingSoon`
        for (const [, , meta] of moves.value) {
          if (meta.mode === mode.value) {
            if (meta.status === InfiniteMoveStatus.RemovingSoon) {
              meta.status = InfiniteMoveStatus.Removed;
              break;
            }
          }
        }
      }
      break;
    }
  }
};

const togglePlayer = () => {
  const index = +(currentPlayer.value === Player.O);
  const player = [Player.O, Player.X][index];
  currentPlayer.value = player as Player;
};

const check = () => {
  const board = mapMovesToBoard(size.value, moves.value);

  const oSuccess = isPlayerSuccess(board, Player.O);
  const xSuccess = isPlayerSuccess(board, Player.X);

  switch (mode.value) {
    case Mode.Classic: {
      if (oSuccess || xSuccess) {
        const winner = oSuccess ? Player.O : Player.X;
        return winner;
      }
      // no winner yet, check if it is a draw game
      const marks = board.flat().filter(player => player !== null) as Player[];
      if (marks.length === size.value * size.value) {
        // all boxes are occupied
        return 'DRAW';
      }
      break;
    }
    case Mode.CoverUp: {
      if (oSuccess && xSuccess) {
        // both succeed at the same time
        return 'DRAW';
      }
      if (oSuccess || xSuccess) {
        const winner = oSuccess ? Player.O : Player.X;
        return winner;
      }
      break;
    }
    case Mode.Infinite: {
      if (oSuccess || xSuccess) {
        const winner = oSuccess ? Player.O : Player.X;
        return winner;
      }
      break;
    }
  }

  return null;
};

export const reset = () => {
  moves.value = [];
  currentPlayer.value = Player.O;
  winner.value = null;
};
