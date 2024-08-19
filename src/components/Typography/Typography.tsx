import classNames from 'classnames';
import React from 'react';

// import styles from './Typography.module.scss';

/**
 * original props
 */
interface IProps {
  as?: React.ElementType;
  variant?: keyof typeof VARIANT_CLASSNAMES;
}

/**
 * component props
 */
type TComponentProps<E extends React.ElementType> = React.ComponentPropsWithoutRef<E>;

/**
 * `Typography` props
 */
type TProps<E extends React.ElementType> = IProps & TComponentProps<E>;

const VARIANT_CLASSNAMES = {
  title1: 'text-5xl',
  title2: 'text-4xl',
  title3: 'text-3xl',
  title4: 'text-2xl',
  title5: 'text-xl',
  title6: 'text-lg',
  body1: 'text-base',
  body2: 'text-sm',
  caption: 'text-xs'
} as const;

function Typography<Element extends React.ElementType = 'span'>(props: TProps<Element>) {
  const { className, as: Component = 'span', variant = 'body1', ...otherProps } = props;
  return (
    <Component
      className={classNames(className, VARIANT_CLASSNAMES[variant])}
      {...otherProps}
    />
  );
}

Typography.displayName = 'Typography';

export default Typography;
