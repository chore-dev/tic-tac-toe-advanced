import { Mode } from '../store/game';

export const MODES = {
  [Mode.Classic]: 'Classic',
  [Mode.Infinite]: 'Infinite',
  [Mode.CoverUp]: 'Cover-up'
} as const;
