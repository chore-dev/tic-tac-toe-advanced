import { Button, CircularProgress } from '@nextui-org/react';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import * as gameActions from '../../actions/game';
import * as peerActions from '../../actions/peer';
import Typography from '../../components/Typography/Typography';
import { ROUTES } from '../../constants/routes';
import { ERRORS } from '../../constants/texts';
import OnlineGame from '../../models/OnlineGame';
import { mode, size } from '../../store/game';
// import styles from './Host.module.scss';

/**
 * original props
 */
interface IProps {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'main'>;

/**
 * `Host` props
 */
type TProps = IProps & TComponentProps;

const Host: React.FunctionComponent<TProps> = props => {
  const { className, ...otherProps } = props;

  const navigate = useNavigate();

  const handleCancelButtonClick = useCallback(() => {
    navigate(ROUTES.Home);
  }, [navigate]);

  useEffect(() => {
    const onlineGame = OnlineGame.init(true);
    const peer = onlineGame.initPeer();
    peer.on('open', id => {
      const path = generatePath(ROUTES.PlayOnline, { id });
      navigate(path, { replace: true });
    });
    peer.on('connection', connection => {
      if (!onlineGame.connection.value) {
        connection.on('open', () => {
          const game = onlineGame.initGame(mode.value, size.value);
          const { board, currentPlayer } = game;
          const { moves } = board;
          connection.send(
            gameActions.init(mode.value, size.value, moves.value, currentPlayer.value!)
          );
          onlineGame.bind(connection);
        });
        connection.on('close', () => {
          onlineGame.connection.value = null;
          onlineGame.connected.value = false;
        });
        return;
      }
      // someone has already connected to the host
      connection.on('open', () => {
        connection.send(peerActions.error(ERRORS.GameInProgress));
      });
    });
  }, [navigate]);

  return (
    <main
      className={classNames(className, 'flex flex-col items-center gap-4')}
      {...otherProps}
    >
      <div className='flex items-center gap-4'>
        <Typography variant='title2'>Loading...</Typography>
        <CircularProgress size='sm' />
      </div>
      <Button onClick={handleCancelButtonClick}>Cancel</Button>
    </main>
  );
};

Host.displayName = 'Host';

export default Host;
