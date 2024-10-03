import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons/faCircleArrowLeft';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons/faRotateRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Chip } from '@nextui-org/react';
import { useSignalEffect } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AUDIOS } from '../../constants/audios';
import { ROUTES } from '../../constants/routes';
import { MODES } from '../../constants/texts';
import useAudio from '../../hooks/useAudio';
import useGame from '../../hooks/useGame';
import Board from '../../models/Board';
import { Mode, Player, type TAnyMove } from '../../types/game';
import ClassicBoard from '../Board/ClassicBoard';
import CoverUpBoard from '../Board/CoverUpBoard';
import InfiniteBoard from '../Board/InfiniteBoard';
import PlayerBox from '../PlayerBox/PlayerBox';
import PlayingIcon from '../PlayingIcon/PlayingIcon';
// import styles from './Game.module.scss';

/**
 * original props
 */
interface IProps {
  me?: Player;
  hosted?: boolean;
  connected?: boolean;
  disabled?: boolean;
  onAddMove?: (move: TAnyMove) => void;
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

type THandleAddMove = React.ComponentProps<typeof ClassicBoard>['onAddMove'] &
  React.ComponentProps<typeof CoverUpBoard>['onAddMove'] &
  React.ComponentProps<typeof InfiniteBoard>['onAddMove'];

const BOARD_COMPONENTS = {
  [Mode.Classic]: ClassicBoard,
  [Mode.CoverUp]: CoverUpBoard,
  [Mode.Infinite]: InfiniteBoard,
} as const;

const Game: React.FunctionComponent<TProps> = (props) => {
  useSignals();
  const { className, me, hosted, connected, disabled, onAddMove, onReset, ...otherProps } = props;

  const [game, board] = useGame()!;
  const { mode, currentPlayer, winner } = game!;
  const { moves } = board;
  const _disabled = disabled || !!winner.value;

  const navigate = useNavigate();
  const [playStartAudio] = useAudio(AUDIOS.Start);
  const [playAddMoveAudio] = useAudio(AUDIOS.Move);
  const [playWinnerAudio] = useAudio(AUDIOS.Winner);
  const [playDrawAudio] = useAudio(AUDIOS.Draw);

  const Board = BOARD_COMPONENTS[mode];

  const handleAddMove: THandleAddMove = useCallback(
    (move) => {
      if (!_disabled && !winner.value) {
        const _move = game.addMove(move as TAnyMove);
        onAddMove?.(_move);
      }
    },
    [game, winner, _disabled, onAddMove],
  );

  const handleBackButtonClick = useCallback(() => {
    navigate(ROUTES.Home);
  }, [navigate]);

  const handleResetButtonClick = useCallback(() => {
    game.reset();
    onReset?.();
  }, [game, onReset]);

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

  useEffect(() => {
    game.start();
  }, [game]);

  return (
    <div className={classNames(className, 'flex flex-col items-center gap-4')} {...otherProps}>
      <section className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <PlayerBox
            me={me}
            player={Player.O}
            active={currentPlayer.value === Player.O}
            won={winner.value && winner.value === Player.O}
          />
          <PlayingIcon winner={winner.value} />
          <PlayerBox
            me={me}
            player={Player.X}
            active={currentPlayer.value === Player.X}
            won={winner.value && winner.value === Player.X}
          />
        </div>
      </section>
      <div className="relative flex justify-center">
        <Board
          className={classNames('transition-opacity duration-500 ease-out', {
            'opacity-30': !!winner.value,
          })}
          board={board as Board<TAnyMove>}
          disabled={_disabled}
          onAddMove={handleAddMove}
        />
        {!!winner.value && (!connected || hosted) && (
          <div className={classNames('flex items-center gap-4', 'absolute-center')}>
            <Button
              size="lg"
              startContent={<FontAwesomeIcon size="2x" icon={faCircleArrowLeft} />}
              onClick={handleBackButtonClick}
            >
              Back
            </Button>
            <Button
              size="lg"
              color="primary"
              startContent={<FontAwesomeIcon size="2x" icon={faRotateRight} />}
              onClick={handleResetButtonClick}
            >
              Again
            </Button>
          </div>
        )}
      </div>
      <Chip color="primary" size="lg">
        {MODES[mode]}
      </Chip>
    </div>
  );
};

Game.displayName = 'Game';

export default Game;
