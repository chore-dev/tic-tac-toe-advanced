import { useCallback, useRef } from 'react';

const useAudio = (src: string) => {
  const audio = new Audio(src);
  const audioRef = useRef(audio);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    try {
      stop();
      await audio.play();
    } catch (err) {
      // TODO error handling
    }
  }, [stop]);

  return [play, stop] as const;
};

export default useAudio;
