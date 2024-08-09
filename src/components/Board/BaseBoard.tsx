import classNames from 'classnames';
import React, { useMemo } from 'react';

import { createMatrix } from '../../helpers/game';
import { type TPosition } from '../../store/game';
// import styles from './BaseBoard.module.scss';

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
    <table
      className={classNames(className, 'border-r-2 border-b-2 border-white', 'rounded-lg')}
      border={0}
      {...otherProps}
    >
      <tbody>
        {matrix.map((row, index) => (
          <tr key={index}>
            {row.map((position, index) => (
              <td
                key={index}
                className='inline-flex border-t-2 border-l-2 border-white p-0'
              >
                {children(position)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

BaseBoard.displayName = 'BaseBoard';

export default BaseBoard;
