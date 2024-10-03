const BASE_URL = process.env.PUBLIC_URL + '/assets/audio';

export const AUDIOS = {
  Start: BASE_URL + '/start.mp3',
  Move: BASE_URL + '/move.mp3',
  Winner: BASE_URL + '/winner.mp3',
  Draw: BASE_URL + '/draw.mp3'
} as const;
