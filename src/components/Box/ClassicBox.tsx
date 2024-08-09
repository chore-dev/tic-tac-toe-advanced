import { useComputed } from '@preact/signals-react';
import React, { useCallback } from 'react';

import { currentPlayer, Mode, moves, type TBaseMove, type TPosition } from '../../store/game';
import Mark from '../Mark/Mark';
// import styles from './ClassicBox.module.scss';

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
 * `ClassicBox` props
 */
type TProps = IProps & TComponentProps;

const ClassicBox: React.FunctionComponent<TProps> = props => {
  const { className, disabled, position, onAddMove, ...otherProps } = props;

  const move = useComputed(() =>
    moves.value.find(([, [x, y]]) => x === position[0] && y === position[1])
  );

  const [player] = move.value ?? [];

  const handleClick = useCallback(() => {
    if (!move.value) {
      const move: TBaseMove = [currentPlayer.value, position, { mode: Mode.Classic }];
      onAddMove(move);
    }
  }, [position, onAddMove, move.value]);

  return (
    <button
      className={className}
      disabled={disabled || !!move.value}
      onClick={handleClick}
      {...otherProps}
    >
      {player && (
        <Mark
          player={player}
          active={move.value === moves.value[moves.value.length - 1]}
        />
      )}
    </button>
  );
};

ClassicBox.displayName = 'ClassicBox';

export default ClassicBox;
