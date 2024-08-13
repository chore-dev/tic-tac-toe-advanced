import { signal } from '@preact/signals-react';
import Peer, { type DataConnection } from 'peerjs';

export const hosted = signal(false);

export const peer = signal<Peer | null>(null);

export const connection = signal<DataConnection | null>(null);

export const connected = signal(false);

export const error = signal<string | null>(null);

export const initializePeer = (id?: string) => {
  if (!peer.value) {
    const _peer = id ? new Peer(id) : new Peer();
    peer.value = _peer;
    _peer.on('close', () => {
      peer.value = null;
      connection.value = null;
      error.value = null;
    });
    _peer.on('error', err => {
      // console.info('peer error:', err.type);
      switch (err.type) {
        // case 'disconnected': {
        //   connection.value = null;
        //   connected.value = false;
        //   break;
        // }
        case 'peer-unavailable': {
          error.value = 'The host is not available';
        }
      }
    });
    // _peer.on('disconnected', () => {
    //   // console.info('peer disconnected');
    // });
  }
  return peer.value;
};

export const reset = () => {
  peer.value?.destroy();

  hosted.value = false;
  peer.value = null;
  connection.value = null;
  connected.value = false;
  error.value = null;
};
