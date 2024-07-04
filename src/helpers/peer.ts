import type { DataConnection } from 'peerjs';

import {
  addMove,
  currentPlayer,
  mode,
  Mode,
  moves,
  reset,
  size,
  type TMove,
  type TPlayer,
  type TPosition
} from '../store/game';

/** init game config with the host */
type TGameInitData = {
  type: 'game:init';
  payload: {
    size: number;
    mode: Mode;
    moves: TMove[];
    currentPlayer: TPlayer;
  };
};

type TGameMoveData = {
  type: 'game:move';
  payload: {
    position: TPosition;
    player: TPlayer;
  };
};

type TGameResetData = {
  type: 'game:reset';
};

export type TConnectionData = TGameInitData | TGameMoveData | TGameResetData;

export const bindOnlineModeDataEvents = (connection: DataConnection) => {
  connection.on('data', data => {
    const _data = data as TConnectionData;
    switch (_data.type) {
      case 'game:init': {
        size.value = _data.payload.size;
        mode.value = _data.payload.mode;
        moves.value = _data.payload.moves;
        currentPlayer.value = _data.payload.currentPlayer;
        break;
      }
      case 'game:move': {
        const { position, player } = _data.payload;
        addMove(position, player);
        break;
      }
      case 'game:reset': {
        reset();
        break;
      }
    }
  });
};
