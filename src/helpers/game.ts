import { MODE_KEY, SIZE_KEY } from '../constants/storage';
import { Mode, type Player } from '../types/game';

export const getDefaultSize = (fallbackSize: number) => {
  const size = localStorage.getItem(SIZE_KEY);
  return size !== null ? parseInt(size) : fallbackSize;
};

export const getDefaultMode = (fallbackMode: Mode) => {
  const mode = localStorage.getItem(MODE_KEY);
  const _mode = mode !== null ? (parseInt(mode) as Mode) : fallbackMode;
  return typeof Mode[_mode] !== 'undefined' ? _mode : fallbackMode;
};

/**
 * check if the player has succeeded to mark a line
 * @param matrix the board state containing the active moves
 * @param target the target player
 */
export const isPlayerSuccess = (matrix: (Player | null)[][], target: Player) => {
  const size = matrix.length;

  const checkRow = (row: (typeof matrix)[number]) => {
    return row.every(player => player === target);
  };

  const checkColumn = (column: number) => {
    return checkRow(matrix.map(row => row[column]!));
  };

  const checkDiagonal = () => {
    const diagonal1 = [] as Player[];
    const diagonal2 = [] as Player[];
    for (let i = 0; i < size; i++) {
      diagonal1.push(matrix[i]![i]!);
      diagonal2.push(matrix[i]![size - i - 1]!);
    }
    return checkRow(diagonal1) || checkRow(diagonal2);
  };

  const checkRowsResult = matrix.some(row => checkRow(row));
  const checkColumnsResult = matrix.some((_, index) => checkColumn(index));
  const checkDiagonalsResult = checkDiagonal();

  return checkRowsResult || checkColumnsResult || checkDiagonalsResult;
};
