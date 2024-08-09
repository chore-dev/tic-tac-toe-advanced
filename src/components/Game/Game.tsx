import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons/faCircleArrowLeft';
import { faHandshakeSimple } from '@fortawesome/free-solid-svg-icons/faHandshakeSimple';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons/faRotateRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Chip } from '@nextui-org/react';
import { useSignalEffect } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';
import useAudio from '../../hooks/useAudio';
import {
  addMove,
  currentPlayer,
  Mode,
  mode,
  moves,
  Player,
  reset,
  size,
  winner,
  type TMove
} from '../../store/game';
import ClassicBoard from '../Board/ClassicBoard';
import CoverUpBoard from '../Board/CoverUpBoard';
import InfiniteBoard from '../Board/InfiniteBoard';
import PlayerBox from '../PlayerBox/PlayerBox';
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
      <section className='flex flex-col items-center gap-4'>
        <Chip
          color='primary'
          size='lg'
        >
          {mode}
        </Chip>
        <div className='flex items-center gap-4'>
          <PlayerBox
            me={me}
            player={Player.O}
            active={currentPlayer.value === Player.O}
            won={winner.value && winner.value === Player.O}
          />
          {!winner.value ? (
            <i className='fas fa-2x fa-swords' />
          ) : winner.value !== 'DRAW' ? (
            <i className='fas fa-2x fa-trophy-alt' />
          ) : (
            <FontAwesomeIcon
              size='2x'
              icon={faHandshakeSimple}
            />
          )}
          {/* <FontAwesomeIcon icon={faHandshakeSimple} /> */}
          <PlayerBox
            me={me}
            player={Player.X}
            active={currentPlayer.value === Player.X}
            won={winner.value && winner.value === Player.X}
          />
        </div>
      </section>
      <div className='relative'>
        <Board
          className={classNames('transition-opacity duration-300 ease-out', {
            'opacity-30': !!winner.value
          })}
          size={size.value}
          disabled={disabled}
          onAddMove={handleAddMove}
        />
        {!!winner.value && (!connected || hosted) && (
          <div
            className={classNames(
              'flex items-center gap-4',
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            )}
          >
            <Button
              size='lg'
              startContent={
                <FontAwesomeIcon
                  size='2x'
                  icon={faCircleArrowLeft}
                />
              }
              onClick={handleBackButtonClick}
            >
              Back
            </Button>
            <Button
              size='lg'
              color='primary'
              startContent={
                <FontAwesomeIcon
                  size='2x'
                  icon={faRotateRight}
                />
              }
              onClick={handleResetButtonClick}
            >
              Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

Game.displayName = 'Game';

export default Game;