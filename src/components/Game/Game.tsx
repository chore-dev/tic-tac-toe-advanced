import { Button, Chip } from '@nextui-org/react';
import { useSignalEffect } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PLAYER_ICONS } from '../../constants/game';
import { ROUTES } from '../../constants/routes';
import useAudio from '../../hooks/useAudio';
import {
  addMove,
  currentPlayer,
  Mode,
  mode,
  moves,
  reset,
  size,
  winner,
  type Player,
  type TMove
} from '../../store/game';
import ClassicBoard from '../Board/ClassicBoard';
import CoverUpBoard from '../Board/CoverUpBoard';
import InfiniteBoard from '../Board/InfiniteBoard';
// import styles from './Game.module.scss';

/**
 * original props
 */
interface IProps {
  me?: Player;
  hosted?: boolean;
  connected?: boolean;
  disabled?: boolean;
  onAddMove?: (move: TMove) => void;
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

const BOARD_COMPONENTS = {
  [Mode.Classic]: ClassicBoard,
  [Mode.CoverUp]: CoverUpBoard,
  [Mode.Infinite]: InfiniteBoard
} as const;

const Game: React.FunctionComponent<TProps> = props => {
  useSignals();

  const { className, me, hosted, connected, disabled, onAddMove, onReset, ...otherProps } = props;

  const Board = BOARD_COMPONENTS[mode.value];

  const navigate = useNavigate();
  const [playStartAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/start.mp3');
  const [playAddMoveAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/move.mp3');
  const [playWinnerAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/winner.mp3');
  const [playDrawAudio] = useAudio(process.env.PUBLIC_URL + '/assets/audio/draw.mp3');

  const handleAddMove: React.ComponentProps<typeof Board>['onAddMove'] = useCallback(
    move => {
      if (!disabled && !winner.value) {
        const _move = addMove(move);
        onAddMove?.(_move);
      }
    },
    [disabled, onAddMove]
  );

  const handleBackButtonClick = useCallback(() => {
    navigate(ROUTES.Home);
  }, [navigate]);

  const handleResetButtonClick = useCallback(() => {
    reset();
    onReset?.();
  }, [onReset]);

  useSignalEffect(() => {
    if (winner.value) {
      if (winner.value === 'DRAW') {
        playDrawAudio();
      } else {
        playWinnerAudio();
      }
    }
  });

  useSignalEffect(() => {
    if (moves.value.length > 0) {
      playAddMoveAudio();
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
        {me && <p>You are {me}</p>}
        {!winner.value && <p>{PLAYER_ICONS[currentPlayer.value]}&#39;s turn</p>}
      </section>
      <Board
        size={size.value}
        disabled={disabled}
        onAddMove={handleAddMove}
      />
      <div className='flex items-center justify-between'>
        {(!connected || hosted) && <Button onClick={handleBackButtonClick}>Back</Button>}
        {winner.value && (
          <>
            <p className='text-lg'>
              {winner.value === 'DRAW' ? <>Draw</> : <>{PLAYER_ICONS[winner.value]} wins!</>}
            </p>
            {(!connected || hosted) && <Button onClick={handleResetButtonClick}>Reset</Button>}
          </>
        )}
      </div>
    </div>
  );
};

Game.displayName = 'Game';

export default Game;
