import useAsyncEffect from '@gtomato-web/react-hooks/lib/core/useAsyncEffect';
import { useCallback, useMemo, useState } from 'react';

const useAudio = (src: string) => {
  // use `AudioContext` to avoid delay in iOS Safari
  const audioContext = useMemo(() => new AudioContext(), []);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const ready = audioBuffer !== null;

  const play = useCallback(() => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }, [audioContext, audioBuffer]);

  useAsyncEffect(async () => {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    setAudioBuffer(audioBuffer);
  }, [src, audioContext]);

  return [ready, play] as const;
};

export default useAudio;
