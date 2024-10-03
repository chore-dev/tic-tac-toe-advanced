import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Mode, Player } from '../types/game';
import { MODES } from './texts';

export const DEFAULT_SIZE = 3;
export const DEFAULT_MODE = Mode.Classic;
export const DEFAULT_PLAYER = Player.O;

export const MODE_OPTIONS = [
  { label: MODES[Mode.Classic], value: Mode.Classic },
  { label: MODES[Mode.Infinite], value: Mode.Infinite },
  { label: MODES[Mode.CoverUp], value: Mode.CoverUp }
];

export const PLAYER_ICONS = {
  [Player.O]: <FontAwesomeIcon icon={faCircle} />,
  [Player.X]: <FontAwesomeIcon icon={faX} />
};

export const COVER_UP_MARK_QUANTITY = 2;

export const COVER_UP_IS_SHOW_TOP_MARK_ONLY = true;
