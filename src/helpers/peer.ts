import Peer, { type DataConnection } from 'peerjs';

import type { TConnectionGameData } from '../actions/game';
import type { TConnectionPeerData } from '../actions/peer';
import { peerJS } from '../config/app';
import { ERRORS } from '../constants/texts';
import { addMove, currentPlayer, mode, moves, reset, size } from '../store/game';
import { connected, connection, error, hosted, peer } from '../store/peer';

export const initializePeer = () => {
  if (!peer.value) {
    const _peer =
      !peerJS.host || !peerJS.port
        ? new Peer()
        : new Peer({
            host: peerJS.host,
            port: peerJS.port ? parseInt(peerJS.port) : undefined,
            secure: true
          });
    _peer.on('close', () => {
      hosted.value = false;
      peer.value = null;
      connection.value = null;
      connected.value = false;
      error.value = null;
    });
    _peer.on('error', err => {
      switch (err.type) {
        case 'peer-unavailable': {
          error.value = ERRORS.PeerUnavailable;
        }
      }
    });
    peer.value = _peer;
  }
  return peer.value;
};

export const bindConnectionEvents = (connection: DataConnection) => {
  connection.on('data', data => {
    const _data = data as TConnectionGameData | TConnectionPeerData;
    switch (_data.type) {
      case 'game:init': {
        size.value = _data.payload.size;
        mode.value = _data.payload.mode;
        moves.value = _data.payload.moves;
        currentPlayer.value = _data.payload.currentPlayer;
        connected.value = true;
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
      case 'peer:error': {
        error.value = _data.payload.message;
        break;
      }
    }
  });
};
