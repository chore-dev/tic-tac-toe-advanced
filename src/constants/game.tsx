import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Player } from '../store/game';

export const PLAYER_ICONS = {
  [Player.O]: <FontAwesomeIcon icon={faCircle} />,
  [Player.X]: <FontAwesomeIcon icon={faX} />
} as const;
