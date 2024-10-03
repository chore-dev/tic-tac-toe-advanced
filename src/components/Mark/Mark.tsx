import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { PLAYER_ICONS } from '../../constants/game';
import { Player } from '../../types/game';
import styles from './Mark.module.scss';

/**
 * original props
 */
interface IProps {
  size?: (typeof SIZES)[keyof typeof SIZES];
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

export const SIZES = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg'
} as const;

const SIZE_CLASSNAMES = {
  [SIZES.Small]: 'text-xl',
  [SIZES.Medium]: 'text-3xl',
  [SIZES.Large]: 'text-5xl'
} as const;

const Mark = forwardRef<HTMLSpanElement, TProps>((props, ref) => {
  const { className, size = SIZES.Large, player, active, bounce = true, ...otherProps } = props;
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
        {PLAYER_ICONS[player]}
      </i>
    </span>
  );
});

Mark.displayName = 'Mark';

export default Mark;
