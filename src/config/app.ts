export const peerJS = {
  host: process.env.REACT_APP_PEER_JS_HOST || undefined,
  port: process.env.REACT_APP_PEER_JS_PORT
    ? parseInt(process.env.REACT_APP_PEER_JS_PORT)
    : undefined
};
