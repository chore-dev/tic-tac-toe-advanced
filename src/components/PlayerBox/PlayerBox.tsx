import { faCrown } from '@fortawesome/free-solid-svg-icons/faCrown';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@nextui-org/react';
import classNames from 'classnames';
import React from 'react';

import type { Player } from '../../store/game';
import Mark from '../Mark/Mark';
import styles from './PlayerBox.module.scss';

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
      isInvisible={typeof me === 'undefined' || me !== player}
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
          styles.box,
          'relative',
          'flex items-center justify-center',
          'border border-slate-300 rounded-lg',
          'transition-all duration-300 ease-out',
          'h-16 w-16 p-4',
          {
            [styles.glow!]: active,
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
          bounce={false}
        />
        {won && (
          <span className={classNames('absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2')}>
            <FontAwesomeIcon
              className={classNames('animate-bounce')}
              size='lg'
              icon={faCrown}
            />
          </span>
        )}
      </div>
    </Badge>
  );
};

PlayerBox.displayName = 'PlayerBox';

export default PlayerBox;
