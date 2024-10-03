import React from 'react';

import type { TClassicModeMove } from '../../models/ClassicGame';
import ClassicBox from '../Box/ClassicBox';
import BaseBoard, { ICommonBoardProps } from './BaseBoard';
// import styles from './ClassicBoard.module.scss';

/**
 * original props
 */
interface IProps extends ICommonBoardProps<TClassicModeMove> {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * `ClassicBoard` props
 */
type TProps = IProps & TComponentProps;

const ClassicBoard: React.FunctionComponent<TProps> = props => {
  const { board, disabled, onAddMove, ...otherProps } = props;
  return (
    <BaseBoard
      board={board}
      {...otherProps}
    >
      {position => (
        <ClassicBox
          className='size-24'
          disabled={disabled}
          position={position}
          onAddMove={onAddMove}
        />
      )}
    </BaseBoard>
  );
};

ClassicBoard.displayName = 'ClassicBoard';

export default ClassicBoard;
