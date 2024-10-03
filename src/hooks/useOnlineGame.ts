import { useSignals } from '@preact/signals-react/runtime';

import { onlineGame } from '../store/game';

const useOnlineGame = () => {
  useSignals();
  if (onlineGame.value) {
    return [onlineGame.value] as const;
  }
  return [] as const;
};

export default useOnlineGame;
