import { Mode, type TMove } from '../types/game';
import BaseGame from './BaseGame';

export enum InfiniteMoveStatus {
  None,
  RemovingSoon,
  Removed
}

export type TInfiniteModeMoveMeta = {
  status: InfiniteMoveStatus;
};

export type TInfiniteModeMove = TMove<TInfiniteModeMoveMeta>;

class InfiniteGame extends BaseGame<TInfiniteModeMove> {
  constructor(size: number) {
    super(Mode.Infinite, size);
  }

  static override activeMoveFilter = (move: TInfiniteModeMove) => {
    const [, , meta] = move;
    const { status } = meta;
    return status === InfiniteMoveStatus.None;
  };

  get state() {
    const { board } = this;
    const matrix = board.createMatrix();
    const moves: TInfiniteModeMove[] = [];
    for (const marks of matrix) {
      for (const mark of marks) {
        const [, position] = mark;
        const move = board.findMove(position, InfiniteGame.activeMoveFilter);
        if (move) {
          const [player] = move;
          mark[0] = player;
          moves.push(move);
        }
      }
    }
    return [moves, matrix] as const;
  }

  override postMove() {
    const { board } = this;
    const { size, moves } = board;
    if (moves.value.length >= size * size - size + 1) {
      // change `RemovingSoon` to `Removed`
      const index = moves.value.findIndex(
        ([, , meta]) => meta.status === InfiniteMoveStatus.RemovingSoon
      );
      const [player, position, meta] = moves.value[index]!;
      const move: TMove<TInfiniteModeMoveMeta> = [
        player,
        position,
        {
          ...meta,
          status: InfiniteMoveStatus.Removed
        }
      ];
      const _moves = [...moves.value];
      _moves.splice(index, 1, move);
      moves.value = _moves;
    }
    if (moves.value.length >= size * size - size) {
      // change the oldest move as `RemovingSoon`
      const index = moves.value.findIndex(([, , meta]) => meta.status === InfiniteMoveStatus.None);
      const [player, position, meta] = moves.value[index]!;
      const move: TMove<TInfiniteModeMoveMeta> = [
        player,
        position,
        {
          ...meta,
          status: InfiniteMoveStatus.RemovingSoon
        }
      ];
      const _moves = [...moves.value];
      _moves.splice(index, 1, move);
      moves.value = _moves;
    }
    return this;
  }

  checkWinner() {
    const [winner] = this.preCheckWinner();
    return winner;
  }
}

export default InfiniteGame;
