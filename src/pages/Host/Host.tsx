import { Button, CircularProgress } from '@nextui-org/react';
import React, { useCallback, useEffect } from 'react';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';

import * as gameActions from '../../actions/game';
import Typography from '../../components/Typography/Typography';
import { ROUTES } from '../../constants/routes';
import { bindOnlineModeDataEvents } from '../../helpers/peer';
import { currentPlayer, mode, moves, size } from '../../store/game';
import { connected, connection, hosted, initializePeer } from '../../store/peer';
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
  const [params] = useSearchParams();

  const id = params.get('id');

  const handleCancelButtonClick = useCallback(() => {
    navigate(ROUTES.Home);
  }, [navigate]);

  useEffect(() => {
    const _peer = initializePeer(id || undefined);
    _peer.on('open', id => {
      hosted.value = true;
      const path = generatePath(ROUTES.PlayOnline, { id });
      navigate(path, { replace: true });
    });
    _peer.on('connection', _connection => {
      connection.value = _connection;
      _connection.on('open', () => {
        _peer.disconnect();
        connected.value = true;
        _connection.send(
          gameActions.init(size.value, mode.value, moves.value, currentPlayer.value)
        );
        bindOnlineModeDataEvents(_connection);
      });
      _connection.on('close', () => {
        connected.value = false;
      });
    });
  }, [navigate, id]);

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
