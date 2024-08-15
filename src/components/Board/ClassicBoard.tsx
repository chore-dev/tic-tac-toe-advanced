import React from 'react';

import type { TBaseMove } from '../../store/game';
import ClassicBox from '../Box/ClassicBox';
import BaseBoard from './BaseBoard';
// import styles from './ClassicBoard.module.scss';

/**
 * original props
 */
interface IProps {
  disabled?: boolean;
  onAddMove: (move: TBaseMove) => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<typeof BaseBoard>;
type TOmittedProps = 'children';

/**
 * `ClassicBoard` props
 */
type TProps = IProps & Omit<TComponentProps, TOmittedProps>;

const ClassicBoard: React.FunctionComponent<TProps> = props => {
  const { disabled, onAddMove, ...otherProps } = props;
  return (
    <BaseBoard {...otherProps}>
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
