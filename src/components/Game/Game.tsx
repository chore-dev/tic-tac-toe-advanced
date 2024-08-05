import { Button, Chip } from '@nextui-org/react';
import { effect } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PLAYER_ICONS } from '../../constants/game';
import { ROUTES } from '../../constants/routes';
import useAudio from '../../hooks/useAudio';
import { currentPlayer, mode, moves, reset, size, winner, type Player } from '../../store/game';
import Board from '../Board/Board';
// import styles from './Game.module.scss';

/**
 * original props
 */
interface IProps {
  me?: Player;
  hosted?: boolean;
  connected?: boolean;
  disabled?: boolean;
  onAddMove?: React.ComponentProps<typeof Board>['onAddMove'];
  onReset?: () => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * `Game` props
 */
type TProps = IProps & TComponentProps;

const Game: React.FunctionComponent<TProps> = props => {
  useSignals();

  const { className, me, hosted, connected, disabled, onAddMove, onReset, ...otherProps } = props;

  const gameover = !connected || hosted;

  const navigate = useNavigate();
  const [playStartAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/start.mp3');
  const [playWinnerAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/winner.mp3');
  const [playDrawAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/draw.mp3');

  const handleBackButtonClick = useCallback(() => {
    navigate(ROUTES.Home);
  }, [navigate]);

  const handleResetButtonClick = useCallback(() => {
    reset();
    onReset?.();
  }, [onReset]);

  effect(() => {
    if (winner.value) {
      if (winner.value === 'DRAW') {
        playDrawAudio();
      } else {
        playWinnerAudio();
      }
    }
  });

  useEffect(() => {
    playStartAudio();
  }, [playStartAudio]);

  return (
    <div
      className={classNames(className, 'flex flex-col gap-4')}
      {...otherProps}
    >
      <section className='flex flex-col items-center gap-2'>
        <Chip>{mode}</Chip>
        {me && <div>You are {me}</div>}
        <div>{PLAYER_ICONS[currentPlayer.value]}&#39;s turn</div>
      </section>
      <Board
        size={size.value}
        moves={moves.value}
        disabled={disabled}
        onAddMove={onAddMove}
      />
      {winner.value && (
        <div className='flex items-center justify-between'>
          {gameover && <Button onClick={handleBackButtonClick}>Back</Button>}
          <p className='text-lg'>
            {winner.value === 'DRAW' ? <>Draw</> : <>{PLAYER_ICONS[winner.value]} wins!</>}
          </p>
          {gameover && <Button onClick={handleResetButtonClick}>Reset</Button>}
        </div>
      )}
    </div>
  );
};

Game.displayName = 'Game';

export default Game;
