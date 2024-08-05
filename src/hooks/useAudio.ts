import { useCallback, useRef } from 'react';

const useAudio = (src: string) => {
  const audio = new Audio(src);
  const audioRef = useRef(audio);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    try {
      await audio.play();
    } catch (err) {
      // TODO error handling
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  return [play, stop] as const;
};

export default useAudio;
