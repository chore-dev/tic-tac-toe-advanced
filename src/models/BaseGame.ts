import { signal } from '@preact/signals-react';

import { DEFAULT_PLAYER } from '../constants/game';
import { isPlayerSuccess } from '../helpers/game';
import { Player, type Mode, type TAnyMove, type TMark, type TWinner } from '../types/game';
import Board from './Board';

type TState<M> = [moves: M[], marks: TMark[][]];

abstract class BaseGame<M extends TAnyMove> {
  mode: Mode;
  /** the board instance */
  board: Board<M>;
  /** the current player */
  currentPlayer = signal<Player | null>(DEFAULT_PLAYER);
  /** the winner or `"DRAW"`, `null`: the game is not finished yet */
  winner = signal<TWinner>(null);

  constructor(mode: Mode, size: number) {
    this.mode = mode;
    this.board = new Board(size);
  }

  static activeMoveFilter = (move: TAnyMove, index: number, moves: TAnyMove[]) => {
    // to be overridden
    return true;
  };

  abstract get state(): Readonly<TState<M>>;

  config(currentPlayer: Player, moves: M[]) {
    this.currentPlayer.value = currentPlayer;
    this.board.moves.value = moves;
    return this;
  }

  start() {
    this.currentPlayer.value = DEFAULT_PLAYER;
    this.winner.value = null;
    return this;
  }

  addMove(move: M) {
    const { moves } = this.board;
    const [player, position, meta] = move;
    const _move = [
      player,
      position,
      {
        ...meta,
        id: moves.value.length + 1
      }
    ] as M;
    this.board.place(_move);
    const winner = this.checkWinner();
    if (!winner) {
      this.postMove();
      this.togglePlayer();
    } else {
      this.winner.value = winner;
    }
    return _move;
  }

  postMove() {
    // to be overridden
    return this;
  }

  togglePlayer() {
    const mapping = {
      [Player.O]: Player.X,
      [Player.X]: Player.O
    } as const;
    const { currentPlayer } = this;
    if (currentPlayer.value !== null) {
      const nextPlayer = mapping[currentPlayer.value];
      currentPlayer.value = nextPlayer;
    }
    return currentPlayer.value;
  }

  protected preCheckWinner() {
    const { state } = this;
    const [, matrix] = state;
    const _matrix = matrix.map(row => row.map(([player]) => player));
    const oSuccess = isPlayerSuccess(_matrix, Player.O);
    const xSuccess = isPlayerSuccess(_matrix, Player.X);
    if (oSuccess && xSuccess) {
      return [null, true, true] as const;
    }
    if (oSuccess || xSuccess) {
      const winner = oSuccess ? Player.O : Player.X;
      return [winner, oSuccess, xSuccess] as const;
    }
    return [null, false, false] as const;
  }

  abstract checkWinner(): TWinner;

  reset() {
    this.board.clear();
    this.currentPlayer.value = DEFAULT_PLAYER;
    this.winner.value = null;
    return this;
  }
}

export default BaseGame;
