import React from "react";

const sounds = {
  Right: "right.mp3",
  Wrong: "wrong.mp3",
  Waiting: "theme.mp3",
  "Time's Up": "times-up.mp3"
};

type SoundName = keyof typeof sounds;

export const SoundBoard = () => (
  <div>
    {(Object.keys(sounds) as any).map((sound: SoundName) => (
      <SoundButton key={sound} sound={sound} />
    ))}
  </div>
);

interface SoundProps {
  sound: SoundName;
}

const SoundButton = ({ sound }: SoundProps) => {
  const player = React.createRef<AudioPlayer>();

  return (
    <>
      <Sound ref={player} src={`/sfx/${sounds[sound]}`} />
      <button
        className="btn btn-primary"
        onClick={() => player && player.current && player.current.play()}
      >
        {sound}
      </button>
    </>
  );
};

export const Sound = React.forwardRef<AudioPlayer, { src: string }>(
  ({ src }, player) => {
    const audioEl = React.createRef<HTMLAudioElement>();

    const stop = () => {
      const audio = audioEl.current;

      if (audio && audio.currentTime > 0) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    const play = () => {
      const audio = audioEl.current;

      if (audio) {
        stop();
        audio.play();
      }
    };

    Object.assign(player, {
      current: { stop, play }
    });

    return <audio ref={audioEl} preload="auto" autoPlay={false} src={src} />;
  }
);

interface AudioPlayer {
  play(): void;
}

export const usePlayer = (audioEl: React.RefObject<HTMLAudioElement>) => {
  return () => {
    const audio = audioEl.current;

    if (!audio) {
      return;
    }

    if (audio.currentTime > 0) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
  };
};
