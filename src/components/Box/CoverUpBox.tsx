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

export const MARK_SIZE_CLASSNAMES = {
  [CoverUpSize.Small]: 'text-xl',
  [CoverUpSize.Medium]: 'text-3xl',
  [CoverUpSize.Large]: 'text-5xl'
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

  const handleClick: Required<React.ComponentProps<typeof Button>>['onClick'] = useCallback(
    event => {
      if (activeMoves.value.length === 0) {
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
      }
    },
    [position, onAddMove, activeMoves]
  );

  const button = (
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
              className={classNames('absolute', styles.mark, MARK_SIZE_CLASSNAMES[size])}
              player={player}
            />
          </div>
        );
      })}
    </button>
  );

  if (disabled || typeof player !== 'undefined') {
    return button;
  }

  return (
    <Popover
      showArrow
      placement='top'
      isOpen={isSelectionBoxOpened}
      onOpenChange={setIsSelectionBoxOpened}
    >
      <PopoverTrigger>{button}</PopoverTrigger>
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
                    className={MARK_SIZE_CLASSNAMES[size]}
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
