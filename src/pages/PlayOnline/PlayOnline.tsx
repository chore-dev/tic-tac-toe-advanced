import { Button } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as gameActions from '../../actions/game';
import Game from '../../components/Game/Game';
import { ROUTES } from '../../constants/routes';
import useGame from '../../hooks/useGame';
import useOnlineGame from '../../hooks/useOnlineGame';
import { Player } from '../../types/game';
import Connecting from './Connecting';
import Waiting from './Waiting';
// import styles from './PlayOnline.module.scss';

/**
 * original props
 */
interface IProps {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'main'>;

/**
 * `PlayOnline` props
 */
type TProps = IProps & TComponentProps;

type TParams = {
  id: string;
};

const PlayOnline: React.FunctionComponent<TProps> = props => {
  useSignals();

  const { className, ...otherProps } = props;

  const navigate = useNavigate();
  const { id } = useParams<TParams>();

  const [onlineGame] = useOnlineGame();
  const [game] = useGame();

  // const { hosted, connection, connected } = onlineGame;
  // const { winner, currentPlayer } = game;

  const handleAddMove: Required<React.ComponentProps<typeof Game>>['onAddMove'] = useCallback(
    move => {
      /* send the move to the connected peer */
      onlineGame?.connection.value?.send(gameActions.addMove(move));
    },
    [onlineGame]
  );

  const handleReset = useCallback(() => {
    onlineGame?.connection.value?.send(gameActions.reset());
  }, [onlineGame]);

  const handleCancelButtonClick = useCallback(() => {
    navigate(ROUTES.Home);
  }, [navigate]);

  useEffect(() => {
    return () => {
      onlineGame?.destroy();
    };
  }, [onlineGame]);

  if (!onlineGame || !game) {
    // TODO loading
    return null;
  }

  return (
    <main
      className={classNames(className, 'w-full')}
      {...otherProps}
    >
      {!onlineGame.connected.value ? (
        <div className='flex flex-col items-center gap-4'>
          {!onlineGame.hosted.value ? <Connecting id={id!} /> : <Waiting id={id!} />}
          <Button onClick={handleCancelButtonClick}>Cancel</Button>
        </div>
      ) : (
        <Game
          me={onlineGame.hosted.value ? Player.O : Player.X}
          hosted={onlineGame.hosted.value}
          connected={onlineGame.connected.value}
          disabled={
            !!game.winner.value ||
            (onlineGame.hosted.value
              ? game.currentPlayer.value !== Player.O
              : game.currentPlayer.value !== Player.X)
          }
          onAddMove={handleAddMove}
          onReset={handleReset}
        />
      )}
    </main>
  );
};

PlayOnline.displayName = 'PlayOnline';

export default PlayOnline;
