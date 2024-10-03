import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useEffect } from 'react';

import Game from '../../components/Game/Game';
import { gameFactory } from '../../hooks/useGame';
import { game, mode, size } from '../../store/game';
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

  useEffect(() => {
    game.value = gameFactory(mode.value, size.value);
    return () => {
      game.value = null;
    };
  }, []);

  return (
    <main
      className={classNames(className, 'w-full')}
      {...otherProps}
    >
      {game.value && <Game />}
    </main>
  );
};

PlayLocal.displayName = 'PlayLocal';

export default PlayLocal;
