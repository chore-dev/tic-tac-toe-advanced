import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';

import { createMatrix } from '../../helpers/game';
import { addMove, RemoveState, type TMove, type TPlayer, type TPosition } from '../../store/game';
import Box from '../Box/Box';
// import styles from './Board.module.scss';

/**
 * original props
 */
interface IProps {
  size: number;
  moves: TMove[];
  disabled?: boolean;
  onAddMove?: (position: TPosition, player: TPlayer) => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'table'>;

/**
 * `Board` props
 */
type TProps = IProps & TComponentProps;

const Board: React.FunctionComponent<TProps> = props => {
  const { className, size, moves, disabled, onAddMove, ...otherProps } = props;

  const matrix = useMemo(() => createMatrix(size), [size]);

  const handleBoxClick: React.ComponentProps<typeof Box>['onClick'] = useCallback(
    (position, player) => {
      addMove(position, player);
      onAddMove?.(position, player);
    },
    [onAddMove]
  );

  return (
    <table
      className={classNames(className, 'border border-white')}
      {...otherProps}
    >
      <tbody>
        {matrix.map((row, index) => (
          <tr key={index}>
            {row.map((position, index) => {
              const move = moves.find(
                ([[x, y], , removeState]) =>
                  x === position[0] && y === position[1] && removeState !== RemoveState.Removed
              );
              const [, player, removeState] = move ?? [];
              return (
                <td
                  key={index}
                  className='border border-white'
                >
                  <Box
                    position={position as TPosition}
                    player={player}
                    removeState={removeState}
                    disabled={disabled}
                    onClick={handleBoxClick}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Board.displayName = 'Board';

export default Board;
