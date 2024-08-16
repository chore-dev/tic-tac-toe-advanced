import { signal } from '@preact/signals-react';
import Peer, { type DataConnection } from 'peerjs';

export const hosted = signal(false);

export const peer = signal<Peer | null>(null);

export const connection = signal<DataConnection | null>(null);

export const connected = signal(false);

export const error = signal<string | null>(null);

export const reset = () => {
  peer.value?.destroy();
};
