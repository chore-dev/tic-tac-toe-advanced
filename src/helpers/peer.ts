import type { DataConnection } from 'peerjs';

import {
  addMove,
  currentPlayer,
  mode,
  Mode,
  moves,
  reset,
  size,
  type Player,
  type TMove
} from '../store/game';

/** init game config with the host */
type TGameInitData = {
  type: 'game:init';
  payload: {
    size: number;
    mode: Mode;
    moves: TMove[];
    currentPlayer: Player;
  };
};

type TGameMoveData = {
  type: 'game:addMove';
  payload: {
    move: TMove;
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
      case 'game:addMove': {
        const { move } = _data.payload;
        addMove(move);
        break;
      }
      case 'game:reset': {
        reset();
        break;
      }
    }
  });
};
