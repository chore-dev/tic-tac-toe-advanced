import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';

import { createMatrix } from '../../helpers/game';
import useAudio from '../../hooks/useAudio';
import {
  addMove,
  Mode,
  mode,
  RemoveState,
  winner,
  type Player,
  type TMove,
  type TMoveMeta,
  type TPosition
} from '../../store/game';
import Box from '../Box/Box';
// import styles from './Board.module.scss';

/**
 * original props
 */
interface IProps {
  size: number;
  moves: TMove[];
  disabled?: boolean;
  onAddMove?: (position: TPosition, player: Player) => void;
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

  const [playAddMoveAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/move.mp3');
  const matrix = useMemo(() => createMatrix(size), [size]);

  const handleBoxClick: React.ComponentProps<typeof Box>['onClick'] = useCallback(
    (position, player) => {
      if (!winner.value) {
        const meta = { mode: mode.value } as TMoveMeta;
        switch (meta.mode) {
          case Mode.Infinite: {
            meta.removeState = RemoveState.None;
            break;
          }
        }
        const winner = addMove(position, player, meta);
        if (!winner) {
          playAddMoveAudio();
        }
        onAddMove?.(position, player);
      }
    },
    [onAddMove, playAddMoveAudio]
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
              const move = moves.find(([, [x, y], meta]) => {
                const matched = x === position[0] && y === position[1];
                switch (meta.mode) {
                  case Mode.Infinite: {
                    const { removeState } = meta;
                    return (
                      matched &&
                      (removeState === RemoveState.None || removeState === RemoveState.RemoveNext)
                    );
                  }
                }
                return matched;
              });
              return (
                <td
                  key={index}
                  className='border border-white'
                >
                  <Box
                    move={move}
                    position={position as TPosition}
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
