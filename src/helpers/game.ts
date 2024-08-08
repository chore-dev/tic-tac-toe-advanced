import {
  InfiniteMoveStatus,
  Mode,
  type Player,
  type TCoverUpModeMoveMeta,
  type TMove,
  type TPosition
} from '../store/game';

/**
 * create a matrix of positions
 * @param size
 */
export const createMatrix = (size: number) => {
  return Array.from({ length: size }).map((_, x) =>
    Array.from({ length: size }).map<TPosition>((_, y) => [x, y])
  );
};

/**
 * create a board for marking the players
 * @param size
 */
const createBoard = (size: number) => {
  return Array.from({ length: size }).map(() =>
    Array.from<Player | null>({ length: size }).fill(null)
  );
};

/**
 * create a board and fill in the marks
 */
export const mapMovesToBoard = (size: number, moves: TMove[]) => {
  const matrix = createMatrix(size);
  const board = createBoard(size);
  for (const row of matrix) {
    for (const position of row) {
      const activeMoves = findActiveMoves(moves, position);
      if (activeMoves.length > 0) {
        const [x, y] = position;
        const activeMove = activeMoves[activeMoves.length - 1]!;
        const [player] = activeMove;
        board[x]![y] = player;
      }
    }
  }
  return board;
};

/**
 * find the active moves at the given position
 * @param moves the whole moves history
 * @param [position] the target position, if not provided, all active moves will be returned
 */
export const findActiveMoves = (moves: TMove[], position?: TPosition) => {
  return moves.filter((move, index, moves) => {
    const [, [x, y], meta] = move;
    if (!position || (x === position[0] && y === position[1])) {
      switch (meta.mode) {
        case Mode.Classic: {
          return true;
        }
        case Mode.CoverUp: {
          // check if this mark has been moved to another position
          const _moves = moves.slice(index);
          const _move = _moves.find(([_player, , _meta]) => {
            const { from } = _meta as TCoverUpModeMoveMeta;
            return from === meta.id;
          });
          // active if it has not been moved to another position
          return !_move;
        }
        case Mode.Infinite: {
          const { status } = meta;
          return status === InfiniteMoveStatus.None;
        }
      }
    }
    return false;
  });
};

/**
 * find the latest active move at the given position
 * @param moves the whole moves history
 * @param position the target position
 */
export const findActiveMove = (moves: TMove[], position: TPosition) => {
  const activeMoves = findActiveMoves(moves, position);
  return activeMoves[activeMoves.length - 1];
};

/**
 * check if the player has succeeded to mark a line
 * @param board the board containing the active moves
 * @param target the target player
 */
export const isPlayerSuccess = (board: (Player | null)[][], target: Player) => {
  const size = board.length;

  const checkRow = (row: (typeof board)[number]) => {
    return row.every(player => player === target);
  };

  const checkColumn = (column: number) => {
    return checkRow(board.map(row => row[column]!));
  };

  const checkDiagonal = () => {
    const diagonal1 = [] as Player[];
    const diagonal2 = [] as Player[];
    for (let i = 0; i < size; i++) {
      diagonal1.push(board[i]![i]!);
      diagonal2.push(board[i]![size - i - 1]!);
    }
    return checkRow(diagonal1) || checkRow(diagonal2);
  };

  const checkRowsResult = board.some(row => checkRow(row));
  const checkColumnsResult = board.some((_, index) => checkColumn(index));
  const checkDiagonalsResult = checkDiagonal();

  return checkRowsResult || checkColumnsResult || checkDiagonalsResult;
};
