type TPeerErrorData = {
  type: 'peer:error';
  payload: {
    message: string;
  };
};

export type TConnectionPeerData = TPeerErrorData;

export const error = (message: string): TPeerErrorData => ({
  type: 'peer:error',
  payload: {
    message
  }
});
