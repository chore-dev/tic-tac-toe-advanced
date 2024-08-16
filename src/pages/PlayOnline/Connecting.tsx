import { CircularProgress } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useEffect } from 'react';

import Typography from '../../components/Typography/Typography';
import { bindConnectionEvents, initializePeer } from '../../helpers/peer';
import { connected, connection, error } from '../../store/peer';
// import styles from './Connecting.module.scss';

/**
 * original props
 */
interface IProps {
  /** the host peer ID */
  id: string;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'section'>;

/**
 * `Connecting` props
 */
type TProps = IProps & TComponentProps;

const Connecting: React.FunctionComponent<TProps> = props => {
  useSignals();

  const { className, id, ...otherProps } = props;

  useEffect(() => {
    if (id && !connection.value && !connected.value) {
      const _peer = initializePeer();
      _peer.on('open', () => {
        const _connection = _peer.connect(id);
        connection.value = _connection;
        _connection.on('open', () => {
          bindConnectionEvents(_connection);
        });
        _connection.on('close', () => {
          connected.value = false;
        });
      });
    }
    return;
  }, [id]);

  return (
    <section
      className={classNames(className, 'flex flex-col items-center gap-4 w-full')}
      {...otherProps}
    >
      <div className='flex items-center justify-center gap-4 w-full'>
        {!error.value ? (
          <>
            <Typography
              className='truncate'
              variant='title2'
            >
              Connecting...
            </Typography>
            <CircularProgress size='sm' />
          </>
        ) : (
          <Typography
            className='truncate'
            variant='title2'
          >
            Connection failed
          </Typography>
        )}
      </div>
      <Typography
        className='text-center truncate w-full'
        variant='title4'
      >
        {error.value || id}
      </Typography>
    </section>
  );
};

Connecting.displayName = 'Connecting';

export default Connecting;
