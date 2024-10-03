import { signal } from '@preact/signals-react';
import Peer, { type DataConnection } from 'peerjs';

import type {
  TConnectionGameData,
  TGameAddMoveData,
  TGameInitData,
  TGameResetData
} from '../actions/game';
import type { TConnectionPeerData, TPeerErrorData } from '../actions/peer';
import { host, port } from '../config/peer';
import { ERRORS } from '../constants/texts';
import { gameFactory } from '../hooks/useGame';
import { onlineGame } from '../store/game';
import type { Mode, TGame } from '../types/game';

type TConnectionDataHandler = (
  payload: (TConnectionGameData | TConnectionPeerData)['payload']
) => void;

class OnlineGame {
  peer: Peer | null = null;
  game: TGame | null = null;
  hosted = signal(false);
  connection = signal<DataConnection | null>(null);
  connected = signal(false);
  error = signal<string | null>(null);

  constructor(hosted: boolean) {
    this.hosted.value = hosted;
  }

  static init(...args: ConstructorParameters<typeof OnlineGame>) {
    if (!onlineGame.value) {
      onlineGame.value = new this(...args);
    }
    return onlineGame.value;
  }

  initPeer() {
    const peer =
      typeof host !== 'undefined' || typeof port !== 'undefined'
        ? new Peer()
        : new Peer({ host, port, secure: true });
    peer.on('close', () => {
      this.hosted.value = false;
      this.connection.value = null;
      this.connected.value = false;
      this.error.value = null;
    });
    peer.on('error', err => {
      const mapping = {
        'browser-incompatible': ERRORS.BrowserIncompatible,
        'peer-unavailable': ERRORS.PeerUnavailable
      } as const;
      const error = mapping[err.type as keyof typeof mapping] as
        | (typeof mapping)[keyof typeof mapping]
        | undefined;
      if (error) {
        this.error.value = error;
      }
    });
    this.peer = peer;
    return peer;
  }

  initGame(mode: Mode, size: number) {
    const game = gameFactory(mode, size);
    this.game = game;
    return game;
  }

  /** bind connection data event handlers */
  bind(connection: DataConnection) {
    this.connection.value = connection;
    this.connected.value = true;
    connection.on('data', data => {
      const _data = data as TConnectionGameData | TConnectionPeerData;
      const mapping = {
        'game:init': this.handleGameInit,
        'game:addMove': this.handleGameAddMove,
        'game:reset': this.handleGameReset,
        'peer:error': this.handlePeerError
      } as const;
      const handler = mapping[_data.type] as TConnectionDataHandler;
      handler(_data.payload);
    });
  }

  private handleGameInit = (payload: TGameInitData['payload']) => {
    const { mode, size, moves, currentPlayer } = payload;
    const game = this.initGame(mode, size);
    game.config(currentPlayer, moves);
    this.connected.value = true;
  };

  private handleGameAddMove = (payload: TGameAddMoveData['payload']) => {
    const { move } = payload;
    this.game?.addMove(move);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleGameReset = (payload: TGameResetData['payload']) => {
    this.game?.reset();
  };

  private handlePeerError = (payload: TPeerErrorData['payload']) => {
    const { message } = payload;
    this.error.value = message;
  };

  destroy() {
    this.peer?.destroy();
    this.game = null;
    this.hosted.value = false;
    this.connection.value = null;
    this.connected.value = false;
    this.error.value = null;
    onlineGame.value = null;
    return this;
  }
}

export default OnlineGame;
