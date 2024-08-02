import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PLAYER_ICONS = {
  X: <FontAwesomeIcon icon={faX} />,
  O: <FontAwesomeIcon icon={faCircle} />
} as const;
