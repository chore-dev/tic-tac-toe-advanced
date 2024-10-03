import React from 'react';

import type { TInfiniteModeMove } from '../../models/InfiniteGame';
import InfiniteBox from '../Box/InfiniteBox';
import BaseBoard, { ICommonBoardProps } from './BaseBoard';
// import styles from './InfiniteBoard.module.scss';

/**
 * original props
 */
interface IProps extends ICommonBoardProps<TInfiniteModeMove> {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;
type TOmittedProps = 'children';

/**
 * `InfiniteBoard` props
 */
type TProps = IProps & Omit<TComponentProps, TOmittedProps>;

const InfiniteBoard: React.FunctionComponent<TProps> = props => {
  const { board, disabled, onAddMove, ...otherProps } = props;
  return (
    <BaseBoard
      board={board}
      {...otherProps}
    >
      {position => (
        <InfiniteBox
          className='size-24'
          disabled={disabled}
          position={position}
          onAddMove={onAddMove}
        />
      )}
    </BaseBoard>
  );
};

InfiniteBoard.displayName = 'InfiniteBoard';

export default InfiniteBoard;
