import React from "react";
import { SoundMap, SoundName, SoundMixerPlayer, AudioPlayer } from "./model";
import { Sound } from "./Sound";

export interface SoundMixerProps {
  onPlaySound(sound: SoundName): void;
}

type SoundMixerSounds = {
  [key in SoundName]: AudioPlayer & { component: React.FunctionComponent };
};

export const SoundMixer = React.forwardRef<SoundMixerPlayer>((props, ref) => {
  const [sounds] = React.useState<SoundMixerSounds>(() =>
    (Object.keys(SoundMap) as any).reduce(
      (agg: SoundMixerSounds, sound: SoundName) => {
        const ref = React.createRef<AudioPlayer>();
        agg[sound] = {
          play: () => ref.current && ref.current.play(),
          stop: () => ref.current && ref.current.stop(),
          isPlaying: () => ref.current && ref.current.isPlaying(),
          component: () => <Sound ref={ref} src={SoundMap[sound]} />
        };
        return agg;
      },
      {} as SoundMixerSounds
    )
  );

  const play = React.useCallback(
    (sound: SoundName) =>
      Object.keys(sounds)
        .map(x => x as SoundName)
        .forEach(name => {
          const isPlaying = sounds[name].isPlaying();
          const isRequestedSound = name === sound;

          if (isPlaying) {
            sounds[name].stop();

            if (isRequestedSound) {
              // stop - don't play
              return;
            }
          }

          if (isRequestedSound) {
            sounds[sound].play();
          }
        }),
    [sounds]
  );

  Object.assign(ref, {
    current: { play }
  });

  return (
    <>
      {Object.keys(sounds)
        .map(x => x as SoundName)
        .map(sound => {
          const Component = sounds[sound].component;
          return <Component key={sound} />;
        })}
    </>
  );
});
