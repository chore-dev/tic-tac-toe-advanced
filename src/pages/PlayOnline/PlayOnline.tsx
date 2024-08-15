import { Button } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as gameActions from '../../actions/game';
import Game from '../../components/Game/Game';
import { ROUTES } from '../../constants/routes';
import { currentPlayer, Player, winner } from '../../store/game';
import { connected, connection, hosted } from '../../store/peer';
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

const PlayOnline: React.FunctionComponent<TProps> = props => {
  useSignals();

  const { className, ...otherProps } = props;

  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const handleAddMove: Required<React.ComponentProps<typeof Game>>['onAddMove'] = useCallback(
    move => {
      /* send the move to the connected peer */
      connection.value?.send(gameActions.addMove(move));
    },
    []
  );

  const handleReset = useCallback(() => {
    connection.value?.send(gameActions.reset());
  }, []);

  const handleCancelButtonClick = useCallback(() => {
    navigate(ROUTES.Home);
  }, [navigate]);

  return (
    <main
      className={classNames(className, 'w-full')}
      {...otherProps}
    >
      {!connected.value ? (
        <div className='flex flex-col items-center gap-4'>
          {!hosted.value ? <Connecting id={id!} /> : <Waiting id={id!} />}
          <Button onClick={handleCancelButtonClick}>Cancel</Button>
        </div>
      ) : (
        <Game
          me={hosted.value ? Player.O : Player.X}
          hosted={hosted.value}
          connected={connected.value}
          disabled={
            !!winner.value ||
            (hosted.value ? currentPlayer.value !== Player.O : currentPlayer.value !== Player.X)
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