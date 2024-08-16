import { signal } from '@preact/signals-react';

import { checkWinner, getDefaultMode, getDefaultSize } from '../helpers/game';

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

export const size = signal(getDefaultSize());

export const mode = signal(getDefaultMode());

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
  const _winner = checkWinner(size.value, mode.value, moves.value);
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
      if (moves.value.length >= size.value * size.value - size.value + 1) {
        // remove the move marked as `RemovingSoon`
        for (let i = 0; i < moves.value.length; i++) {
          const [player, position, meta] = moves.value[i]!;
          if (meta.mode === mode.value) {
            if (meta.status === InfiniteMoveStatus.RemovingSoon) {
              const _moves = [...moves.value];
              const move: TMove = [
                player,
                position,
                {
                  ...meta,
                  status: InfiniteMoveStatus.Removed
                }
              ];
              _moves.splice(i, 1, move);
              moves.value = _moves;
              break;
            }
          }
        }
      }
      if (moves.value.length >= size.value * size.value - size.value) {
        // mark the oldest move as `RemovingSoon`
        for (let i = 0; i < moves.value.length; i++) {
          const [player, position, meta] = moves.value[i]!;
          if (meta.mode === mode.value) {
            if (meta.status === InfiniteMoveStatus.None) {
              const _moves = [...moves.value];
              const move: TMove = [
                player,
                position,
                {
                  ...meta,
                  status: InfiniteMoveStatus.RemovingSoon
                }
              ];
              _moves.splice(i, 1, move);
              moves.value = _moves;
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

export const reset = () => {
  moves.value = [];
  currentPlayer.value = Player.O;
  winner.value = null;
};
