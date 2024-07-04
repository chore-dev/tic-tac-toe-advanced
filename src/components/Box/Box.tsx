import classNames from 'classnames';
import React, { useCallback } from 'react';

import { currentPlayer, RemoveState, winner, type TPlayer, type TPosition } from '../../store/game';
// import styles from './Box.module.scss';

/**
 * original props
 */
interface IProps {
  position: TPosition;
  player?: TPlayer;
  removeState?: RemoveState;
  disabled?: boolean;
  onClick: (position: TPosition, player: TPlayer) => void;
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
  const { className, position, player, disabled, removeState, onClick, ...otherProps } = props;

  const handleClick = useCallback(() => {
    if (!player && !disabled && !winner.value) {
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
      {typeof removeState !== 'undefined' && removeState !== RemoveState.Removed && (
        <span className={classNames({ 'opacity-30': removeState === RemoveState.RemoveNext })}>
          {player}
        </span>
      )}
    </div>
  );
};

Box.displayName = 'Box';

export default Box;
