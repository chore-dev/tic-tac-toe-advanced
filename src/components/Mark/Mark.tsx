import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { PLAYER_ICONS } from '../../constants/game';
import { Player } from '../../store/game';

/**
 * original props
 */
interface IProps {
  size?: 'sm' | 'md' | 'lg';
  player: Player;
  active?: boolean;
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
  const { className, size = 'lg', player, active, ...otherProps } = props;
  return (
    <span
      ref={ref}
      className={twMerge(
        'inline-flex text-5xl',
        COLOR_CLASSNAMES[player],
        SIZE_CLASSNAMES[size],
        className
      )}
      {...otherProps}
    >
      <i
        className={classNames('transition-[filter] duration-300 ease-out', {
          'drop-shadow-glow': active
        })}
      >
        {player && PLAYER_ICONS[player]}
      </i>
    </span>
  );
});

Mark.displayName = 'Mark';

export default Mark;
