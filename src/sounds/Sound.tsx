import React from "react";
import { AudioPlayer } from "./model";

export const Sound = React.forwardRef<AudioPlayer, { src: string }>(
  ({ src }, player) => {
    const audioEl = React.createRef<HTMLAudioElement>();

    const isPlaying = () => {
      const audio = audioEl.current;
      return audio && audio.currentTime > 0;
    };

    const stop = () => {
      const audio = audioEl.current;
      audio.pause();
      audio.currentTime = 0;
    };

    const play = () => {
      const audio = audioEl.current;

      if (audio) {
        stop();
        audio.play();
      }
    };

    Object.assign(player, {
      current: { stop, play, isPlaying }
    });

    return <audio ref={audioEl} preload="auto" autoPlay={false} src={src} />;
  }
);
