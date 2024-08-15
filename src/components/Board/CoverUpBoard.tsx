import { DndContext } from '@dnd-kit/core';
import React, { useCallback } from 'react';

import { findActiveMove } from '../../helpers/game';
import {
  currentPlayer,
  Mode,
  moves,
  type TBaseMove,
  type TCoverUpModeMoveMeta,
  type TPosition
} from '../../store/game';
import CoverUpBox from '../Box/CoverUpBox';
import BaseBoard from './BaseBoard';
// import styles from './CoverUpBoard.module.scss';

/**
 * original props
 */
interface IProps {
  disabled?: boolean;
  onAddMove: (move: TBaseMove) => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<typeof BaseBoard>;
type TOmittedProps = 'children';

/**
 * `CoverUpBoard` props
 */
type TProps = IProps & Omit<TComponentProps, TOmittedProps>;

const CoverUpBoard: React.FunctionComponent<TProps> = props => {
  const { disabled, onAddMove, ...otherProps } = props;

  const handleDragEnd: Required<React.ComponentProps<typeof DndContext>>['onDragEnd'] = useCallback(
    event => {
      const { active, over } = event;
      const { position: activePosition } = active.data.current as { position: TPosition };
      const { position: overPosition } = (over?.data.current ?? {}) as { position: TPosition };
      if (overPosition) {
        if (activePosition.join() !== overPosition.join()) {
          const activeMove = findActiveMove(moves.value, activePosition);
          if (activeMove) {
            const overMove = findActiveMove(moves.value, overPosition);
            const [, , activeMoveMeta] = activeMove;
            const [, , overMoveMeta] = overMove ?? [];
            const activeMoveSize = (activeMoveMeta as TCoverUpModeMoveMeta).size;
            const overMoveSize = (overMoveMeta as TCoverUpModeMoveMeta)?.size ?? -1;
            if (activeMoveSize > overMoveSize) {
              const move: TBaseMove = [
                currentPlayer.value,
                overPosition,
                {
                  mode: Mode.CoverUp,
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
    [onAddMove]
  );

  const handleAddMove: React.ComponentProps<typeof CoverUpBox>['onAddMove'] = useCallback(
    move => {
      // check if the move is valid
      const [, position, meta] = move;
      const activeMove = findActiveMove(moves.value, position);
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
    [onAddMove]
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <BaseBoard {...otherProps}>
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
