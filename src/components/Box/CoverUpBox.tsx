import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useComputed } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import { COVER_UP_MARK_QUANTITY, IS_COVERED_MARKS_DISPLAYED } from '../../constants/game';
import { findActiveMoves } from '../../helpers/game';
import {
  CoverUpSize,
  currentPlayer,
  Mode,
  moves,
  Player,
  type TBaseMove,
  type TCoverUpModeMoveMeta,
  type TPosition
} from '../../store/game';
import Mark from '../Mark/Mark';
import styles from './CoverUpBox.module.scss';

/**
 * original props
 */
interface IProps {
  position: TPosition;
  onAddMove: (move: TBaseMove) => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * `CoverUpBox` props
 */
type TProps = IProps & TComponentProps;

const MARK_SIZES = {
  [CoverUpSize.Small]: 'sm',
  [CoverUpSize.Medium]: 'md',
  [CoverUpSize.Large]: 'lg'
} as const;

const CoverUpBox: React.FunctionComponent<TProps> = props => {
  useSignals();

  const { className, disabled, position, onAddMove, ...otherProps } = props;

  const activeMoves = useComputed(() => findActiveMoves(moves.value, position));
  const activeMove = activeMoves.value[activeMoves.value.length - 1];
  const [player] = activeMove ?? [];
  const displayMoves = IS_COVERED_MARKS_DISPLAYED ? activeMoves.value : activeMoves.value.slice(-1);

  const markSizeOptionsMapping = useComputed(() => {
    const activeMoves = findActiveMoves(moves.value);
    return activeMoves.reduce(
      (mapping, move) => {
        const [player, , meta] = move;
        const { size } = meta as TCoverUpModeMoveMeta;
        mapping[player][size]![1] -= 1;
        return mapping;
      },
      {
        [Player.O]: [
          [CoverUpSize.Small, COVER_UP_MARK_QUANTITY],
          [CoverUpSize.Medium, COVER_UP_MARK_QUANTITY],
          [CoverUpSize.Large, COVER_UP_MARK_QUANTITY]
        ],
        [Player.X]: [
          [CoverUpSize.Small, COVER_UP_MARK_QUANTITY],
          [CoverUpSize.Medium, COVER_UP_MARK_QUANTITY],
          [CoverUpSize.Large, COVER_UP_MARK_QUANTITY]
        ]
      } as Record<Player, [CoverUpSize, number][]>
    );
  });

  const [isSelectionBoxOpened, setIsSelectionBoxOpened] = useState(false);
  const {
    attributes,
    listeners,
    transform,
    isDragging,
    setNodeRef: setDraggableNodeRef
  } = useDraggable({
    id: `drag-${position.join('-')}`,
    data: { position },
    disabled: disabled || (typeof player !== 'undefined' && player !== currentPlayer.value)
  });
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: `drop-${position.join('-')}`,
    data: { position },
    disabled
  });

  const style = useMemo(
    () => ({
      transform: CSS.Translate.toString(transform)
    }),
    [transform]
  );

  const handlePopoverOpenChange: Required<React.ComponentProps<typeof Popover>>['onOpenChange'] =
    useCallback(
      open => {
        if (!disabled) {
          setIsSelectionBoxOpened(open);
        }
      },
      [disabled]
    );

  const handleClick: Required<React.ComponentProps<typeof Button>>['onClick'] = useCallback(
    event => {
      const { size } = event.currentTarget.dataset;
      const move: TBaseMove = [
        currentPlayer.value,
        position,
        {
          mode: Mode.CoverUp,
          size: parseInt(size!) as CoverUpSize
        }
      ];
      onAddMove(move);
      setIsSelectionBoxOpened(false);
    },
    [position, onAddMove]
  );

  return (
    <Popover
      showArrow
      placement='top'
      isOpen={isSelectionBoxOpened}
      onOpenChange={handlePopoverOpenChange}
    >
      <PopoverTrigger>
        <button
          ref={setDroppableNodeRef}
          className={classNames(className, 'relative')}
          disabled={disabled || typeof player !== 'undefined'}
          {...otherProps}
        >
          {displayMoves.map((move, index) => {
            const [player, , meta] = move;
            const { size } = meta as TCoverUpModeMoveMeta;
            return (
              <div
                key={index}
                className={classNames('absolute inset-0', styles.move, {
                  'z-[1]': isDragging
                })}
                // only the last one is draggable
                {...(index === displayMoves.length - 1
                  ? {
                      ref: setDraggableNodeRef,
                      style,
                      ...attributes,
                      ...listeners
                    }
                  : {})}
              >
                <Mark
                  className={classNames('absolute', styles.mark)}
                  size={MARK_SIZES[size]}
                  player={player}
                  active={activeMove === moves.value[moves.value.length - 1]}
                />
              </div>
            );
          })}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <ol className='flex items-center gap-2'>
          {markSizeOptionsMapping.value[currentPlayer.value].map(([size, quantity]) => (
            <li
              key={size}
              className='inline-flex'
            >
              <Badge
                content={quantity}
                size='md'
              >
                <Button
                  isIconOnly
                  size='lg'
                  variant='light'
                  isDisabled={quantity === 0}
                  data-size={size}
                  onClick={handleClick}
                >
                  <Mark
                    size={MARK_SIZES[size]}
                    player={currentPlayer.value}
                  />
                </Button>
              </Badge>
            </li>
          ))}
        </ol>
      </PopoverContent>
    </Popover>
  );
};

CoverUpBox.displayName = 'CoverUpBox';

export default CoverUpBox;
