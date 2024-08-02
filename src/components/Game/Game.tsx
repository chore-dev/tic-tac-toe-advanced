import { Button, Chip } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback } from 'react';

import { PLAYER_ICONS } from '../../constants/game';
import { currentPlayer, mode, moves, reset, size, winner } from '../../store/game';
import Board from '../Board/Board';
// import styles from './Game.module.scss';

/**
 * original props
 */
interface IProps {
  me?: 'O' | 'X';
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

  const handleResetButtonClick = useCallback(() => {
    reset();
    onReset?.();
  }, [onReset]);

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
          <p className='text-lg'>
            {winner.value === 'DRAW' ? <>Draw</> : <>{PLAYER_ICONS[winner.value]} wins!</>}
          </p>
          {(!connected || hosted) && <Button onClick={handleResetButtonClick}>Reset</Button>}
        </div>
      )}
    </div>
  );
};

Game.displayName = 'Game';

export default Game;
