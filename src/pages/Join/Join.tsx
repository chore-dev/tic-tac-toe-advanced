import React, { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';
import useOnlineGame from '../../hooks/useOnlineGame';
import OnlineGame from '../../models/OnlineGame';
// import styles from './Join.module.scss';

/**
 * original props
 */
interface IProps {}

/**
 * component props
 */
type TComponentProps = {};

/**
 * `Join` props
 */
type TProps = IProps & TComponentProps;

type TParams = {
  id: string;
};

const Join: React.FunctionComponent<TProps> = props => {
  const { id } = useParams<TParams>();

  const navigate = useNavigate();

  const [onlineGame] = useOnlineGame();

  useEffect(() => {
    const onlineGame = OnlineGame.init(false);
    const peer = onlineGame.initPeer();
    peer.on('open', () => {
      const connection = peer.connect(id!);
      connection.on('open', () => {
        onlineGame.bind(connection);
        const path = generatePath(ROUTES.PlayOnline, { id: id! });
        navigate(path, { replace: true });
      });
      connection.on('close', () => {
        onlineGame.connected.value = false;
      });
    });
  }, [id]);

  return null;
};

Join.displayName = 'Join';

export default Join;
