import classNames from 'classnames';
import React, { useCallback } from 'react';
import useGame from '../../hooks/useGame';

import type InfiniteGame from '../../models/InfiniteGame';
import type { TInfiniteModeMove, TInfiniteModeMoveMeta } from '../../models/InfiniteGame';
import { InfiniteMoveStatus } from '../../models/InfiniteGame';
import Mark from '../Mark/Mark';
import type { IBaseProps } from './BaseBox';
import styles from './InfiniteBox.module.scss';

/**
 * original props
 */
interface IProps extends IBaseProps<TInfiniteModeMove> {}

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

  const [game, board] = useGame<InfiniteGame>()!;
  const { currentPlayer } = game;
  const { moves } = board;

  const move = moves.value.find(([, [x, y], meta]) => {
    const { status } = meta;
    return x === position[0] && y === position[1] && status !== InfiniteMoveStatus.Removed;
  });

  const [player, , meta] = move ?? [];
  const { status } = (meta ?? {}) as Partial<TInfiniteModeMoveMeta>;

  const handleClick = useCallback(() => {
    if (!move) {
      const move: TInfiniteModeMove = [
        currentPlayer.value!,
        position,
        {
          status: InfiniteMoveStatus.None
        }
      ];
      onAddMove(move);
    }
  }, [position, onAddMove, currentPlayer, move]);

  return (
    <button
      className={classNames(className, {
        [styles.pulse!]: status === InfiniteMoveStatus.RemovingSoon
      })}
      disabled={disabled || !!move}
      onClick={handleClick}
      {...otherProps}
    >
      {player && status !== InfiniteMoveStatus.Removed && (
        <Mark
          player={player}
          active={move === moves.value[moves.value.length - 1]}
        />
      )}
    </button>
  );
};

InfiniteBox.displayName = 'InfiniteBox';

export default InfiniteBox;
