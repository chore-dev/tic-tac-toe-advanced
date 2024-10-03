import { Mode, type TMove } from '../types/game';
import BaseGame from './BaseGame';

export enum CoverUpSize {
  Small,
  Medium,
  Large
}

export type TCoverUpModeMoveMeta = {
  size: CoverUpSize;
  from?: number;
};

export type TCoverUpModeMove = TMove<TCoverUpModeMoveMeta>;

class CoverUpGame extends BaseGame<TCoverUpModeMove> {
  constructor(size: number) {
    super(Mode.CoverUp, size);
  }

  static override activeMoveFilter = (
    move: TCoverUpModeMove,
    index: number,
    moves: TCoverUpModeMove[]
  ) => {
    const [, , meta] = move;
    // check if this mark has been moved to another position
    const _moves = moves.slice(index);
    const _move = _moves.find(([, , { from }]) => from === meta.id);
    // active if it has not been moved to another position
    return !_move;
  };

  get state() {
    const { board } = this;
    const matrix = board.createMatrix();
    const moves: TCoverUpModeMove[] = [];
    for (const marks of matrix) {
      for (const mark of marks) {
        const [, position] = mark;
        const move = board.findMove(position, CoverUpGame.activeMoveFilter);
        if (move) {
          const [player] = move;
          mark[0] = player;
          moves.push(move);
        }
      }
    }
    return [moves, matrix] as const;
  }

  checkWinner() {
    const [winner, oSuccess, xSuccess] = this.preCheckWinner();
    if (winner !== null) {
      return winner;
    }
    if (oSuccess && xSuccess) {
      // both succeed at the same time
      return 'DRAW';
    }
    return null;
  }
}

export default CoverUpGame;
