import { Mode, type TMove } from '../types/game';
import BaseGame from './BaseGame';

export type TClassicModeMoveMeta = Record<string, never>;
export type TClassicModeMove = TMove<TClassicModeMoveMeta>;

class ClassicGame extends BaseGame<TClassicModeMove> {
  constructor(size: number) {
    super(Mode.Classic, size);
  }

  static override activeMoveFilter = () => {
    return true;
  };

  get state() {
    const { board } = this;
    const matrix = board.createMatrix();
    const moves: TClassicModeMove[] = [];
    for (const row of matrix) {
      for (const mark of row) {
        const [, position] = mark;
        const move = board.findMove(position, ClassicGame.activeMoveFilter);
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
    const [winner] = this.preCheckWinner();
    if (winner !== null) {
      return winner;
    }
    const { board, state } = this;
    const { size } = board;
    const [moves] = state;
    // no winner yet, check if it is a draw game
    if (moves.length === size * size) {
      // all boxes are occupied
      return 'DRAW';
    }
    return null;
  }
}

export default ClassicGame;
