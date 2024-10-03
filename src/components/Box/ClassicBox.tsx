import React, { useCallback } from 'react';

import useGame from '../../hooks/useGame';
import type ClassicGame from '../../models/ClassicGame';
import type { TClassicModeMove } from '../../models/ClassicGame';
import Mark from '../Mark/Mark';
import type { IBaseProps } from './BaseBox';
// import styles from './ClassicBox.module.scss';

/**
 * original props
 */
interface IProps extends IBaseProps<TClassicModeMove> {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * `ClassicBox` props
 */
type TProps = IProps & TComponentProps;

const ClassicBox: React.FunctionComponent<TProps> = props => {
  const { className, disabled, position, onAddMove, ...otherProps } = props;

  const [game, board] = useGame<ClassicGame>()!;
  const { currentPlayer } = game;
  const { moves } = board;

  const move = moves.value.find(([, [x, y]]) => x === position[0] && y === position[1]);

  const [player] = move ?? [];

  const handleClick = useCallback(() => {
    if (!move) {
      const move: TClassicModeMove = [currentPlayer.value!, position, {}];
      onAddMove(move);
    }
  }, [position, onAddMove, currentPlayer, move]);

  return (
    <button
      className={className}
      disabled={disabled || !!move}
      onClick={handleClick}
      {...otherProps}
    >
      {player && (
        <Mark
          player={player}
          active={move === moves.value[moves.value.length - 1]}
        />
      )}
    </button>
  );
};

ClassicBox.displayName = 'ClassicBox';

export default ClassicBox;
