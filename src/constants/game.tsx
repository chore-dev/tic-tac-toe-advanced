import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Mode, Player } from '../store/game';
import { MODES } from './texts';

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

export const IS_COVERED_MARKS_DISPLAYED = false;
