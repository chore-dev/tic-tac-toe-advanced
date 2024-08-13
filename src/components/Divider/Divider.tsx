import { Divider } from '@nextui-org/react';
import classNames from 'classnames';
import React from 'react';

// import styles from './Divider.module.scss';

/**
 * original props
 */
interface IProps {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * `Divider` props
 */
type TProps = IProps & TComponentProps;

const CustomDivider: React.FunctionComponent<TProps> = props => {
  const { className, children, ...otherProps } = props;
  const divider = <Divider className='w-auto flex-1' />;
  return (
    <div
      className={classNames(className, 'flex items-center gap-2 relative')}
      {...otherProps}
    >
      {children ? (
        <>
          {divider}
          {children}
          {divider}
        </>
      ) : (
        divider
      )}
    </div>
  );
};

CustomDivider.displayName = 'CustomDivider';

export default CustomDivider;
