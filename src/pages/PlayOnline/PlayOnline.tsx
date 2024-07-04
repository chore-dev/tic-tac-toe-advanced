import { Button } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as gameActions from '../../actions/game';
import Game from '../../components/Game/Game';
import { ROUTES } from '../../constants/routes';
import { currentPlayer } from '../../store/game';
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
    (position, player) => {
      /* send the move to the connected peer */
      connection.value?.send(gameActions.move(position, player));
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
      className={className}
      {...otherProps}
    >
      {!connected.value ? (
        <div className='flex flex-col items-center gap-4'>
          {!hosted.value ? <Connecting id={id!} /> : <Waiting id={id!} />}
          <Button onClick={handleCancelButtonClick}>Cancel</Button>
        </div>
      ) : (
        <Game
          me={hosted.value ? 'O' : 'X'}
          hosted={hosted.value}
          connected={connected.value}
          disabled={hosted.value ? currentPlayer.value !== 'O' : currentPlayer.value !== 'X'}
          onAddMove={handleAddMove}
          onReset={handleReset}
        />
      )}
    </main>
  );
};

PlayOnline.displayName = 'PlayOnline';

export default PlayOnline;
