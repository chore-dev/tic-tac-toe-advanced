import { CircularProgress } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React from 'react';

import Typography from '../../components/Typography/Typography';
// import useOnlineGame from '../../hooks/useOnlineGame';
import type OnlineGame from '../../models/OnlineGame';
// import styles from './Connecting.module.scss';

/**
 * original props
 */
interface IProps {
  /** the host peer ID */
  id: string;
  /** the online game instance */
  onlineGame: OnlineGame;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'section'>;

/**
 * `Connecting` props
 */
type TProps = IProps & TComponentProps;

const Connecting: React.FunctionComponent<TProps> = (props) => {
  useSignals();

  const { className, id, onlineGame, ...otherProps } = props;

  const { error } = onlineGame;

  // const [onlineGame] = useOnlineGame();

  return (
    <section
      className={classNames(className, 'flex flex-col items-center gap-4 w-full')}
      {...otherProps}
    >
      <div className="flex items-center justify-center gap-4 w-full">
        {!error.value ? (
          <>
            <Typography className="truncate" variant="title2">
              Connecting...
            </Typography>
            <CircularProgress size="sm" />
          </>
        ) : (
          <Typography className="truncate" variant="title2">
            Connection failed
          </Typography>
        )}
      </div>
      <Typography className="text-center truncate w-full" variant="title4">
        {error.value || id}
      </Typography>
    </section>
  );
};

Connecting.displayName = 'Connecting';

export default Connecting;
