import { Mode } from '../types/game';

export const MODES = {
  [Mode.Classic]: 'Classic',
  [Mode.Infinite]: 'Infinite',
  [Mode.CoverUp]: 'Cover-up'
} as const;

export const ERRORS = {
  BrowserIncompatible: 'Your device is incompatible with this game.',
  PeerUnavailable: 'The host is not available.',
  GameInProgress: 'The game is in progress.'
} as const;
