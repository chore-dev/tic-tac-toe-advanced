import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@nextui-org/react';
import classNames from 'classnames';
import React from 'react';

import type { Player } from '../../store/game';
import Mark from '../Mark/Mark';
// import styles from './Player.module.scss';

/**
 * original props
 */
interface IProps {
  me?: Player;
  player: Player;
  active: boolean;
  won?: boolean | null;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * `PlayerBox` props
 */
type TProps = IProps & TComponentProps;

const PlayerBox: React.FunctionComponent<TProps> = props => {
  const { className, me, player, active, won, ...otherProps } = props;
  return (
    <Badge
      className='h-6 w-6'
      color='primary'
      shape='circle'
      isInvisible={me !== player}
      content={
        <FontAwesomeIcon
          size='xs'
          icon={faUser}
        />
      }
    >
      <div
        className={classNames(
          className,
          'relative',
          'flex items-center justify-center',
          'border border-white rounded-lg',
          'transition-all duration-300 ease-out',
          'h-16 w-16 p-4',
          {
            'shadow-glow': active,
            'opacity-30': won === false,
            'scale-110': won
          }
        )}
        {...otherProps}
      >
        <Mark
          size='md'
          player={player}
          active={active}
        />
      </div>
    </Badge>
  );
};

PlayerBox.displayName = 'PlayerBox';

export default PlayerBox;
