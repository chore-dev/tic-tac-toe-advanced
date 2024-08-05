import { signal } from '@preact/signals-react';

export enum Mode {
  Classic = 'Classic',
  Infinite = 'Infinite',
  CoverUp = 'Cover-up'
}

export enum Player {
  O = 'O',
  X = 'X'
}

export enum RemoveState {
  None,
  RemoveNext,
  Removed
}

export enum CoverUpSize {
  Small,
  Medium,
  Large
}

/** "O" will be the host player */
export type TPlayer = Player;
export type TPosition = [x: number, y: number];
type TClassicModeMoveMeta = {
  mode: Mode.Classic;
};
type TInfiniteModeMoveMeta = {
  mode: Mode.Infinite;
  removeState: RemoveState;
};
type TCoverUpModeMoveMeta = {
  mode: Mode.CoverUp;
  from: TPosition;
  size: CoverUpSize;
};
export type TMoveMeta = TClassicModeMoveMeta | TInfiniteModeMoveMeta | TCoverUpModeMoveMeta;
export type TMove = [player: Player, position: TPosition, meta: TMoveMeta];
export type TWinner = Player | 'DRAW';

export const size = signal(3);

export const mode = signal(Mode.Infinite);

export const moves = signal<TMove[]>([]);

export const currentPlayer = signal(Player.O);

export const winner = signal<TWinner | null>(null);

export const addMove = (
  position: TPosition,
  player: Player,
  meta: TMoveMeta = { mode: Mode.Classic }
) => {
  const move = moves.value.find(([, [x, y], meta]) => {
    const matched = x === position[0] && y === position[1];
    if (meta.mode === Mode.Infinite) {
      const { removeState } = meta;
      return matched && removeState !== RemoveState.Removed;
    }
    return matched;
  });
  if (!move) {
    // add the move if position is not occupied
    moves.value = [...moves.value, [player, position, meta]];
  }
  // check winner
  const _winner = check();
  if (!_winner) {
    postPlace();
    togglePlayer();
  } else {
    winner.value = _winner;
  }
  return _winner;
};

export const postPlace = () => {
  if (mode.value === Mode.Infinite) {
    if (moves.value.length >= size.value * size.value - size.value) {
      for (const [, , meta] of moves.value) {
        if (meta.mode === mode.value) {
          if (meta.removeState === RemoveState.None) {
            meta.removeState = RemoveState.RemoveNext;
            break;
          }
        }
      }
    }
    if (moves.value.length >= size.value * size.value - size.value + 1) {
      for (const [, , meta] of moves.value) {
        if (meta.mode === mode.value) {
          if (meta.removeState === RemoveState.RemoveNext) {
            meta.removeState = RemoveState.Removed;
            break;
          }
        }
      }
    }
  }
};

const togglePlayer = () => {
  const index = +(currentPlayer.value === Player.O);
  const player = [Player.O, Player.X][index];
  currentPlayer.value = player as Player;
};

const check = () => {
  const matrix = Array.from({ length: size.value }).map(() =>
    Array.from<Player>({ length: size.value })
  );
  const _moves = moves.value.filter(([, , meta]) => {
    if (meta.mode === Mode.Infinite) {
      const { removeState } = meta;
      return removeState === RemoveState.None;
    }
    return true;
  });
  for (const [player, [x, y]] of _moves) {
    matrix[x]![y] = player;
  }

  const checkRow = (row: Player[]) => {
    return row.every(player => player === Player.X) || row.every(player => player === Player.O);
  };

  const checkColumn = (matrix: Player[][], column: number) => {
    return checkRow(matrix.map(row => row[column]!));
  };

  const checkDiagonal = (matrix: Player[][]) => {
    const diagonal1 = [] as Player[];
    const diagonal2 = [] as Player[];
    for (let i = 0; i < size.value; i++) {
      diagonal1.push(matrix[i]![i]!);
      diagonal2.push(matrix[i]![size.value - i - 1]!);
    }
    return checkRow(diagonal1) || checkRow(diagonal2);
  };

  const checkRowsResult = matrix.some(row => checkRow(row));
  const checkColumnsResult = matrix.some((_, index) => checkColumn(matrix, index));
  const checkDiagonalsResult = checkDiagonal(matrix);

  if (checkRowsResult || checkColumnsResult || checkDiagonalsResult) {
    return currentPlayer.value;
  }

  if (_moves.length === size.value * size.value) {
    return 'DRAW';
  }

  return null;
};

export const reset = () => {
  moves.value = [];
  currentPlayer.value = Player.O;
  winner.value = null;
};
