import classNames from 'classnames';
import React, { useMemo } from 'react';

import { createMatrix } from '../../helpers/game';
import { type TPosition } from '../../store/game';
import styles from './BaseBoard.module.scss';

/**
 * original props
 */
interface IProps {
  size: number;
  children: (position: TPosition) => React.ReactNode;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'table'>;
type TOmittedProps = 'children';

/**
 * `BaseBoard` props
 */
type TProps = IProps & Omit<TComponentProps, TOmittedProps>;

const BaseBoard: React.FunctionComponent<TProps> = props => {
  const { className, size, children, ...otherProps } = props;

  const matrix = useMemo(() => createMatrix(size), [size]);

  return (
    <div
      className={classNames(className, styles.board, 'shadow-glow')}
      {...otherProps}
    >
      {matrix.flat().map((position, index) => (
        <div
          key={index}
          className='flex'
        >
          {children(position)}
        </div>
      ))}
    </div>
  );
};

BaseBoard.displayName = 'BaseBoard';

export default BaseBoard;
