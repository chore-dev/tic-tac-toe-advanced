import { useSignals } from '@preact/signals-react/runtime';

// import type BaseGame from '../models/BaseGame';
import ClassicGame from '../models/ClassicGame';
import CoverUpGame from '../models/CoverUpGame';
import InfiniteGame from '../models/InfiniteGame';
import { game } from '../store/game';
import { Mode, type TGame } from '../types/game';

// type TExtractMove<G> = G extends BaseGame<infer M> ? M : never;

export function gameFactory(mode: Mode.Classic, size: number): ClassicGame;
export function gameFactory(mode: Mode.CoverUp, size: number): CoverUpGame;
export function gameFactory(mode: Mode.Infinite, size: number): InfiniteGame;
export function gameFactory(mode: Mode, size: number): TGame;
export function gameFactory(mode: Mode, size: number) {
  const mapping = {
    [Mode.Classic]: ClassicGame,
    [Mode.CoverUp]: CoverUpGame,
    [Mode.Infinite]: InfiniteGame
  } as const;
  const Game = mapping[mode];
  const game = new Game(size);
  return game;
}

const useGame = <G extends TGame, TBoard = G['board']>() => {
  useSignals();
  if (game.value) {
    const { board } = game.value;
    return [game.value as G, board as TBoard] as const;
  }
  return null;
};

export default useGame;
