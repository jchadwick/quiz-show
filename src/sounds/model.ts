export const SoundMap = {
  Right: `${process.env.PUBLIC_URL}/sfx/right.mp3`,
  Wrong: `${process.env.PUBLIC_URL}/sfx/wrong.mp3`,
  Waiting: `${process.env.PUBLIC_URL}/sfx/theme.mp3`,
  "Time's Up": `${process.env.PUBLIC_URL}/sfx/times-up.mp3`
};

export type SoundName = keyof typeof SoundMap;

export interface AudioPlayer {
  play(): void;
  stop(): void;
  isPlaying(): boolean;
}

export interface SoundMixerPlayer {
  play(sound: SoundName): void;
}
