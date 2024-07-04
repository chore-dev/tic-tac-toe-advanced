import { useSignals } from '@preact/signals-react/runtime';
import React from 'react';

import Game from '../../components/Game/Game';
import { winner } from '../../store/game';
// import styles from './PlayLocal.module.scss';

/**
 * original props
 */
interface IProps {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'main'>;

/**
 * `PlayLocal` props
 */
type TProps = IProps & TComponentProps;

const PlayLocal: React.FunctionComponent<TProps> = props => {
  useSignals();
  const { className, ...otherProps } = props;
  return (
    <main
      className={className}
      {...otherProps}
    >
      <Game disabled={!!winner.value} />
    </main>
  );
};

PlayLocal.displayName = 'PlayLocal';

export default PlayLocal;
