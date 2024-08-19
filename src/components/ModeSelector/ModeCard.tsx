import { faGamepad } from '@fortawesome/free-solid-svg-icons/faGamepad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import Typography from '../Typography/Typography';

// import styles from './ModeCard.module.scss';

/**
 * original props
 */
interface IProps {
  icon?: React.ReactNode;
  color?: string;
  name: string;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * `ModeCard` props
 */
type TProps = IProps & TComponentProps;

const ModeCard: React.FunctionComponent<TProps> = props => {
  const { className, name, ...otherProps } = props;
  return (
    <div
      className={classNames(
        className,
        'bg-slate-300',
        'p-4',
        'rounded-lg',
        'text-background text-center'
      )}
      {...otherProps}
    >
      <FontAwesomeIcon
        icon={faGamepad}
        size='4x'
      />
      <Typography
        as='div'
        className='mt-2'
        variant='title6'
      >
        {name}
      </Typography>
    </div>
  );
};

ModeCard.displayName = 'ModeCard';

export default ModeCard;
