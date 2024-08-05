import { useCallback, useEffect, useRef } from 'react';

const useAudio = (src: string) => {
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = src;
    return () => {
      audio.remove();
    };
  }, [src]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    audio.play();
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  return [play, stop] as const;
};

export default useAudio;
