import { signal } from '@preact/signals-react';
import { DEFAULT_MODE, DEFAULT_SIZE } from '../constants/game';

import { getDefaultMode, getDefaultSize } from '../helpers/game';
import type OnlineGame from '../models/OnlineGame';
import type { TGame } from '../types/game';

export const size = signal(getDefaultSize(DEFAULT_SIZE));
export const mode = signal(getDefaultMode(DEFAULT_MODE));

/** the online game instance */
export const onlineGame = signal<OnlineGame | null>(null);

/** the game instance */
export const game = signal<TGame | null>(null);
