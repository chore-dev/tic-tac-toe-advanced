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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <BaseBoard {...otherProps}>
        {position => (
          <CoverUpBox
            className='h-24 w-24'
            disabled={disabled}
            position={position}
            onAddMove={onAddMove}
          />
        )}
      </BaseBoard>
    </DndContext>
  );
};

CoverUpBoard.displayName = 'CoverUpBoard';

export default CoverUpBoard;
