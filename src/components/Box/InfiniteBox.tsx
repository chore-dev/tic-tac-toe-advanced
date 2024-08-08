import { useComputed } from '@preact/signals-react';
import classNames from 'classnames';
import React, { useCallback } from 'react';

import {
  currentPlayer,
  InfiniteMoveStatus,
  Mode,
  moves,
  type TBaseMove,
  type TInfiniteModeMoveMeta,
  type TPosition
} from '../../store/game';
import Mark from '../Mark/Mark';
import styles from './InfiniteBox.module.scss';

/**
 * original props
 */
interface IProps {
  position: TPosition;
  onAddMove: (move: TBaseMove) => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * `InfiniteBox` props
 */
type TProps = IProps & TComponentProps;

const InfiniteBox: React.FunctionComponent<TProps> = props => {
  const { className, disabled, position, onAddMove, ...otherProps } = props;

  const move = useComputed(() =>
    moves.value.find(([, [x, y], meta]) => {
      const { status } = meta as TInfiniteModeMoveMeta;
      return x === position[0] && y === position[1] && status !== InfiniteMoveStatus.Removed;
    })
  );

  const [player, , meta] = move.value ?? [];
  const { status } = (meta ?? {}) as TInfiniteModeMoveMeta;

  const handleClick = useCallback(() => {
    if (!move.value) {
      const move: TBaseMove = [
        currentPlayer.value,
        position,
        {
          mode: Mode.Infinite,
          status: InfiniteMoveStatus.None
        }
      ];
      onAddMove(move);
    }
  }, [position, onAddMove, move.value]);

  return (
    <button
      className={classNames(className, {
        [styles.pulse!]: status === InfiniteMoveStatus.RemovingSoon
      })}
      disabled={disabled || !!move.value}
      onClick={handleClick}
      {...otherProps}
    >
      {player && status !== InfiniteMoveStatus.Removed && <Mark player={player} />}
    </button>
  );
};

InfiniteBox.displayName = 'InfiniteBox';

export default InfiniteBox;
