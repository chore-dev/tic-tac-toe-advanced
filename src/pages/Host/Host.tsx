import { Button, CircularProgress } from '@nextui-org/react';
import React, { useCallback, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import * as gameActions from '../../actions/game';
import * as peerActions from '../../actions/peer';
import Typography from '../../components/Typography/Typography';
import { ROUTES } from '../../constants/routes';
import { ERRORS } from '../../constants/texts';
import { bindConnectionEvents, initializePeer } from '../../helpers/peer';
import { currentPlayer, mode, moves, size } from '../../store/game';
import { connected, connection, hosted } from '../../store/peer';
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
    const _peer = initializePeer();
    _peer.on('open', id => {
      hosted.value = true;
      const path = generatePath(ROUTES.PlayOnline, { id });
      navigate(path, { replace: true });
    });
    _peer.on('connection', _connection => {
      if (!connection.value) {
        connection.value = _connection;
        _connection.on('open', () => {
          connected.value = true;
          _connection.send(
            gameActions.init(size.value, mode.value, moves.value, currentPlayer.value)
          );
          bindConnectionEvents(_connection);
        });
        _connection.on('close', () => {
          connection.value = null;
          connected.value = false;
        });
      } else {
        _connection.on('open', () => {
          _connection.send(peerActions.error(ERRORS.GameInProgress));
        });
      }
    });
  }, [navigate]);

  return (
    <main
      className={className}
      {...otherProps}
    >
      <div className='flex flex-col items-center gap-4'>
        <div className='flex items-center gap-4'>
          <Typography variant='title2'>Loading...</Typography>
          <CircularProgress size='sm' />
        </div>
        <Button onClick={handleCancelButtonClick}>Cancel</Button>
      </div>
    </main>
  );
};

Host.displayName = 'Host';

export default Host;
