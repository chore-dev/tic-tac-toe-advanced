import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { PLAYER_ICONS } from '../../constants/game';
import { Player } from '../../store/game';
import styles from './Mark.module.scss';

/**
 * original props
 */
interface IProps {
  size?: 'sm' | 'md' | 'lg';
  player: Player;
  active?: boolean;
  bounce?: boolean;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'span'>;

/**
 * `Mark` props
 */
type TProps = IProps & TComponentProps;

const COLOR_CLASSNAMES = {
  [Player.O]: 'text-blue-500',
  [Player.X]: 'text-red-500'
} as const;

export const SIZE_CLASSNAMES = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-5xl'
} as const;

const Mark = forwardRef<HTMLSpanElement, TProps>((props, ref) => {
  const { className, size = 'lg', player, active, bounce = true, ...otherProps } = props;
  return (
    <span
      ref={ref}
      className={twMerge('inline-flex', SIZE_CLASSNAMES[size], className)}
      {...otherProps}
    >
      <i
        className={classNames(styles.mark, COLOR_CLASSNAMES[player], {
          [styles.active!]: active,
          [styles.bounce!]: bounce
        })}
        data-player={player}
      >
        {player && PLAYER_ICONS[player]}
      </i>
    </span>
  );
});

Mark.displayName = 'Mark';

export default Mark;
