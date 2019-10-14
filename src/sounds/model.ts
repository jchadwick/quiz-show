export const SoundMap = {
  Right: "/sfx/right.mp3",
  Wrong: "/sfx/wrong.mp3",
  Waiting: "/sfx/theme.mp3",
  "Time's Up": "/sfx/times-up.mp3"
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
