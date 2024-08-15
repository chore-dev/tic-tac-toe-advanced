import React from 'react';

import type { TBaseMove } from '../../store/game';
import InfiniteBox from '../Box/InfiniteBox';
import BaseBoard from './BaseBoard';
// import styles from './InfiniteBoard.module.scss';

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
 * `InfiniteBoard` props
 */
type TProps = IProps & Omit<TComponentProps, TOmittedProps>;

const InfiniteBoard: React.FunctionComponent<TProps> = props => {
  const { disabled, onAddMove, ...otherProps } = props;
  return (
    <BaseBoard {...otherProps}>
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
