import { DndContext } from '@dnd-kit/core';
import React, { useCallback } from 'react';

import useGame from '../../hooks/useGame';
import CoverUpGame from '../../models/CoverUpGame';
import type { TCoverUpModeMove, TCoverUpModeMoveMeta } from '../../models/CoverUpGame';
import type { TPosition } from '../../types/game';
import CoverUpBox from '../Box/CoverUpBox';
import BaseBoard, { ICommonBoardProps } from './BaseBoard';
// import styles from './CoverUpBoard.module.scss';

/**
 * original props
 */
interface IProps extends ICommonBoardProps<TCoverUpModeMove> {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;
type TOmittedProps = 'children';

/**
 * `CoverUpBoard` props
 */
type TProps = IProps & Omit<TComponentProps, TOmittedProps>;

type TDragEndEventData = {
  position?: TPosition;
};

const CoverUpBoard: React.FunctionComponent<TProps> = props => {
  const { board, disabled, onAddMove, ...otherProps } = props;

  const [game] = useGame<CoverUpGame>()!;
  const { currentPlayer } = game;

  const handleDragEnd: Required<React.ComponentProps<typeof DndContext>>['onDragEnd'] = useCallback(
    event => {
      const { active, over } = event;
      const { position: activePosition } = (active.data.current ?? {}) as TDragEndEventData;
      const { position: overPosition } = (over?.data.current ?? {}) as TDragEndEventData;
      if (activePosition && overPosition) {
        if (activePosition.join() !== overPosition.join()) {
          const activeMove = board.findMove(activePosition, CoverUpGame.activeMoveFilter);
          if (activeMove) {
            const overMove = board.findMove(overPosition, CoverUpGame.activeMoveFilter);
            const [, , activeMoveMeta] = activeMove;
            const [, , overMoveMeta] = overMove ?? [];
            const activeMoveSize = (activeMoveMeta as TCoverUpModeMoveMeta).size;
            const overMoveSize = (overMoveMeta as TCoverUpModeMoveMeta)?.size ?? -1;
            if (activeMoveSize > overMoveSize) {
              const move: TCoverUpModeMove = [
                currentPlayer.value!,
                overPosition,
                {
                  id: -1,
                  size: activeMoveSize,
                  from: activeMoveMeta.id
                }
              ];
              onAddMove(move);
            }
          }
        }
      }
    },
    [board, onAddMove, currentPlayer]
  );

  const handleAddMove: React.ComponentProps<typeof CoverUpBox>['onAddMove'] = useCallback(
    move => {
      // check if the move is valid
      const [, position, meta] = move;
      const activeMove = board.findMove(position, CoverUpGame.activeMoveFilter);
      if (activeMove) {
        const { size } = meta as TCoverUpModeMoveMeta;
        const [, , activeMoveMeta] = activeMove;
        const { size: activeMoveSize } = activeMoveMeta as TCoverUpModeMoveMeta;
        // if there is an active move on the position, the size has to be larger than that
        if (size > activeMoveSize) {
          onAddMove(move);
        }
        return;
      }
      onAddMove(move);
    },
    [board, onAddMove]
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <BaseBoard
        board={board}
        {...otherProps}
      >
        {position => (
          <CoverUpBox
            className='size-24'
            disabled={disabled}
            position={position}
            onAddMove={handleAddMove}
          />
        )}
      </BaseBoard>
    </DndContext>
  );
};

CoverUpBoard.displayName = 'CoverUpBoard';

export default CoverUpBoard;
