import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { PLAYER_ICONS } from '../../constants/game';
import { Player } from '../../store/game';

/**
 * original props
 */
interface IProps {
  player: Player;
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

const Mark = forwardRef<HTMLSpanElement, TProps>((props, ref) => {
  const { className, player, ...otherProps } = props;
  return (
    <span
      ref={ref}
      className={twMerge(
        'inline-flex text-5xl drop-shadow-md',
        COLOR_CLASSNAMES[player],
        className
      )}
      {...otherProps}
    >
      {player && PLAYER_ICONS[player]}
    </span>
  );
});

Mark.displayName = 'Mark';

export default Mark;
