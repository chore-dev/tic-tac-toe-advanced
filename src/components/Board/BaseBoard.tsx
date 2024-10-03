import classNames from 'classnames';
import React, { useMemo } from 'react';

import Board from '../../models/Board';
import type { TAnyMove, TPosition } from '../../types/game';
import styles from './BaseBoard.module.scss';

export interface ICommonBoardProps<M extends TAnyMove> {
  board: Board<M>;
  disabled?: boolean;
  onAddMove: (move: M) => void;
}

/**
 * original props
 */
interface IProps<M extends TAnyMove> extends Pick<ICommonBoardProps<M>, 'board'> {
  children: (position: TPosition) => React.ReactNode;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;
type TOmittedProps = 'children';

/**
 * `BaseBoard` props
 */
type TProps<M extends TAnyMove> = IProps<M> & Omit<TComponentProps, TOmittedProps>;

function BaseBoard<M extends TAnyMove>(props: TProps<M>) {
  const { className, board, children } = props;

  const matrix = useMemo(() => board.createMatrix(), [board]);
  const marks = matrix.flat();

  return (
    <div className={classNames(className, styles.board, 'shadow-glow')}>
      {marks.map(([, position], index) => (
        <div
          key={index}
          className='flex'
        >
          {children(position)}
        </div>
      ))}
    </div>
  );
}

BaseBoard.displayName = 'BaseBoard';

export default BaseBoard;
