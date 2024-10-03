import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import { COVER_UP_IS_SHOW_TOP_MARK_ONLY, COVER_UP_MARK_QUANTITY } from '../../constants/game';
import useGame from '../../hooks/useGame';
import CoverUpGame, { CoverUpSize, type TCoverUpModeMove } from '../../models/CoverUpGame';
import { Player } from '../../types/game';
import Mark, { SIZES } from '../Mark/Mark';
import type { IBaseProps } from './BaseBox';
import styles from './CoverUpBox.module.scss';

/**
 * original props
 */
interface IProps extends IBaseProps<TCoverUpModeMove> {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * `CoverUpBox` props
 */
type TProps = IProps & TComponentProps;

const MARK_SIZES = {
  [CoverUpSize.Small]: SIZES.Small,
  [CoverUpSize.Medium]: SIZES.Medium,
  [CoverUpSize.Large]: SIZES.Large
} as const;

const CoverUpBox: React.FunctionComponent<TProps> = props => {
  const { className, disabled, position, onAddMove, ...otherProps } = props;

  const [game, board] = useGame<CoverUpGame>()!;
  const { currentPlayer } = game;
  const { moves } = board;

  const activeMoves = board.findMoves(position, CoverUpGame.activeMoveFilter);
  const displayMoves = COVER_UP_IS_SHOW_TOP_MARK_ONLY ? activeMoves.slice(-1) : activeMoves;

  const activeMove = activeMoves[activeMoves.length - 1];
  const [player] = activeMove ?? [];

  // TODO optimization
  const [_moves] = game.state;
  const markSizeOptionsMapping = _moves.reduce(
    (mapping, move) => {
      const [player, , meta] = move;
      const { size } = meta;
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
      const move: TCoverUpModeMove = [
        currentPlayer.value!,
        position,
        {
          size: parseInt(size!) as CoverUpSize
        }
      ];
      onAddMove(move);
      setIsSelectionBoxOpened(false);
    },
    [position, onAddMove, currentPlayer]
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
          className={classNames(className, 'relative focus-visible:outline-none')}
          disabled={disabled || typeof player !== 'undefined'}
          {...otherProps}
        >
          {displayMoves.map((move, index) => {
            const [player, , meta] = move;
            const { size } = meta;
            return (
              <div
                key={`${index}-${size}`}
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
          {markSizeOptionsMapping[currentPlayer.value!].map(([size, quantity]) => (
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
                    player={currentPlayer.value!}
                    bounce={false}
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
