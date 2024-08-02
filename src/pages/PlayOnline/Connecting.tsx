import { CircularProgress } from '@nextui-org/react';
import classNames from 'classnames';
import React, { useEffect } from 'react';

import { bindOnlineModeDataEvents } from '../../helpers/peer';
import { connected, connection, error, initializePeer, peer } from '../../store/peer';
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
  const { className, id, ...otherProps } = props;

  useEffect(() => {
    if (id && !peer.value && !connection.value && !connected.value) {
      const _peer = initializePeer();
      _peer.on('open', () => {
        const _connection = connection.value || _peer.connect(id);
        connection.value = _connection;
        _connection.on('open', () => {
          _peer.disconnect();
          connected.value = true;
          bindOnlineModeDataEvents(_connection);
        });
        _connection.on('close', () => {
          connected.value = false;
        });
      });
    }
  }, [id]);

  return (
    <section
      className={classNames(className, 'flex flex-col items-center gap-4')}
      {...otherProps}
    >
      <div className='flex items-center justify-center gap-4 text-2xl'>
        {!error.value ? (
          <>
            Connecting...
            <CircularProgress size='sm' />
          </>
        ) : (
          <>Connection failed</>
        )}
      </div>
      <p>{error.value || id}</p>
    </section>
  );
};

Connecting.displayName = 'Connecting';

export default Connecting;
