import classNames from 'classnames';
import React, { useCallback } from 'react';

import { PLAYER_ICONS } from '../../constants/game';
import {
  currentPlayer,
  Mode,
  RemoveState,
  type Player,
  type TMove,
  type TPosition
} from '../../store/game';
// import styles from './Box.module.scss';

/**
 * original props
 */
interface IProps {
  move?: TMove;
  position: TPosition;
  disabled?: boolean;
  onClick: (position: TPosition, player: Player) => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;
type TOmitProps = 'onClick';

/**
 * `Box` props
 */
type TProps = IProps & Omit<TComponentProps, TOmitProps>;

const Box: React.FunctionComponent<TProps> = props => {
  const { className, move, position, disabled, onClick, ...otherProps } = props;

  const [player, , meta] = move ?? [];
  const removeState = meta?.mode === Mode.Infinite ? meta.removeState : undefined;

  const handleClick = useCallback(() => {
    if (!player && !disabled) {
      onClick(position, currentPlayer.value);
    }
  }, [position, player, disabled, onClick]);

  return (
    <div
      className={classNames(className, 'h-20 w-20', 'flex items-center justify-center')}
      onClick={handleClick}
      role={!disabled ? 'button' : undefined}
      {...otherProps}
    >
      {(typeof removeState === 'undefined' || removeState !== RemoveState.Removed) && (
        <span className={classNames({ 'opacity-30': removeState === RemoveState.RemoveNext })}>
          {player && PLAYER_ICONS[player]}
        </span>
      )}
    </div>
  );
};

Box.displayName = 'Box';

export default Box;
