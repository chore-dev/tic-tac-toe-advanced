import type { TPosition } from '../../types/game';

export interface IBaseProps<M> {
  position: TPosition;
  onAddMove: (move: M) => void;
}
