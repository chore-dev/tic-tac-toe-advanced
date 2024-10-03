import type ClassicGame from '../models/ClassicGame';
import type CoverUpGame from '../models/CoverUpGame';
import type InfiniteGame from '../models/InfiniteGame';

export enum Player {
  O = 'O',
  X = 'X',
}

export enum Mode {
  Classic,
  Infinite,
  CoverUp,
}

export type TGame = ClassicGame | CoverUpGame | InfiniteGame;

export type TWinner = Player | 'DRAW' | null;

export type TPosition = [x: number, y: number];

export type TBaseMoveMeta = { id?: number };

export type TMove<TMoveMeta extends object> = [
  player: Player,
  position: TPosition,
  meta: TMoveMeta & TBaseMoveMeta,
];

export type TAnyMove = TMove<any>;

export type TMark = [player: Player | null, position: TPosition];
