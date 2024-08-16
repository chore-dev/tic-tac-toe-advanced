import { Mode } from '../store/game';

export const MODES = {
  [Mode.Classic]: 'Classic',
  [Mode.Infinite]: 'Infinite',
  [Mode.CoverUp]: 'Cover-up'
} as const;

export const ERRORS = {
  PeerUnavailable: 'The host is not available.',
  GameInProgress: 'The game is in progress.'
} as const;
