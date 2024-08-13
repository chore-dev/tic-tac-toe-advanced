import classNames from 'classnames';
import React from 'react';

// import styles from './Typography.module.scss';

/**
 * original props
 */
interface IProps {
  as?: React.ElementType;
  variant?: keyof typeof VARIANT_CLASSNAMES;
  bold?: boolean;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<React.ElementType>;

/**
 * `Typography` props
 */
type TProps = IProps & TComponentProps;

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

const Typography: React.FunctionComponent<TProps> = props => {
  const { className, as: Component = 'span', variant = 'body1', bold, ...otherProps } = props;
  return (
    <Component
      className={classNames(className, VARIANT_CLASSNAMES[variant], { 'font-bold': bold })}
      {...otherProps}
    />
  );
};

Typography.displayName = 'Typography';

export default Typography;
