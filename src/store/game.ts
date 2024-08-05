import { signal } from '@preact/signals-react';

export enum Mode {
  Classic = 'Classic',
  Infinite = 'Infinite'
}

export enum RemoveState {
  None,
  RemoveNext,
  Removed
}

/** "O" will be the host player */
export type TPlayer = 'O' | 'X';
export type TPosition = [x: number, y: number];
export type TMove = [position: TPosition, player: TPlayer, removeState: RemoveState];
export type TWinner = TPlayer | 'DRAW';

export const size = signal(3);

export const mode = signal(Mode.Infinite);

export const moves = signal<TMove[]>([]);

export const currentPlayer = signal<TPlayer>('O');

export const winner = signal<TWinner | null>(null);

export const addMove = (position: TPosition, player: TPlayer) => {
  const move = moves.value.find(
    ([[x, y], , removeState]) =>
      x === position[0] && y === position[1] && removeState !== RemoveState.Removed
  );
  if (!move) {
    // add the move if position is not occupied
    moves.value = [...moves.value, [position, player, RemoveState.None]];
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
      const move = moves.value.find(([, , removeState]) => removeState === RemoveState.None);
      if (move) {
        move[2] = RemoveState.RemoveNext;
      }
    }
    if (moves.value.length >= size.value * size.value - size.value + 1) {
      const move = moves.value.find(([, , removeState]) => removeState === RemoveState.RemoveNext);
      if (move) {
        move[2] = RemoveState.Removed;
      }
    }
  }
};

const togglePlayer = () => {
  const index = +(currentPlayer.value === 'O');
  const player = ['O', 'X'][index];
  currentPlayer.value = player as TPlayer;
};

const check = () => {
  const matrix = Array.from({ length: size.value }).map(() =>
    Array.from<TPlayer>({ length: size.value })
  );
  const _moves = moves.value.filter(([, , removeState]) => removeState === RemoveState.None);
  for (const [[x, y], player] of _moves) {
    matrix[x]![y] = player;
  }

  const checkRow = (row: TPlayer[]) => {
    return row.every(player => player === 'X') || row.every(player => player === 'O');
  };

  const checkColumn = (matrix: TPlayer[][], column: number) => {
    return checkRow(matrix.map(row => row[column]!));
  };

  const checkDiagonal = (matrix: TPlayer[][]) => {
    const diagonal1 = [] as TPlayer[];
    const diagonal2 = [] as TPlayer[];
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
  currentPlayer.value = 'O';
  winner.value = null;
};
