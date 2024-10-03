import { signal } from '@preact/signals-react';

import type { TAnyMove, TMark, TPosition } from '../types/game';

class Board<M extends TAnyMove> {
  moves = signal<M[]>([]);

  constructor(public size: number) {}

  createMatrix() {
    const { size } = this;
    return Array.from({ length: size }).map((_, x) =>
      Array.from({ length: size }).map<TMark>((_, y) => [null, [x, y]])
    );
  }

  findMoves(position: TPosition, filter: Parameters<Array<M>['filter']>[0]) {
    const { moves } = this;
    return moves.value.filter((move, index, moves) => {
      const [, [x, y]] = move;
      if (x === position[0] && y === position[1]) {
        return filter(move, index, moves);
      }
      return false;
    });
  }

  findMove(position: TPosition, filter: Parameters<Array<M>['filter']>[0]) {
    const moves = this.findMoves(position, filter);
    return moves[moves.length - 1];
  }

  place(move: M) {
    this.moves.value.push(move);
    return move;
  }

  clear() {
    this.moves.value = [];
  }
}

export default Board;
