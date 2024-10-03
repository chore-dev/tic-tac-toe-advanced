import classNames from 'classnames';
import React from 'react';

import type { TWinner } from '../../types/game';
// import styles from './PlayingIcon.module.scss';

/**
 * original props
 */
interface IProps {
  winner: TWinner;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'i'>;

/**
 * `PlayingIcon` props
 */
type TProps = IProps & TComponentProps;

const PlayingIcon: React.FunctionComponent<TProps> = (props) => {
  const { className, winner, ...otherProps } = props;

  const iconClassName = !winner
    ? 'fad fa-swords'
    : winner !== 'DRAW'
      ? 'fas fa-trophy-alt'
      : 'fas fa-handshake-alt';

  return <i className={classNames(className, 'fa-2x', iconClassName)} {...otherProps} />;
};

PlayingIcon.displayName = 'PlayingIcon';

export default PlayingIcon;
