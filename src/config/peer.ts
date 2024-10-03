export const host = process.env.REACT_APP_PEER_JS_HOST || undefined;

export const port = process.env.REACT_APP_PEER_JS_PORT
  ? parseInt(process.env.REACT_APP_PEER_JS_PORT)
  : undefined;
