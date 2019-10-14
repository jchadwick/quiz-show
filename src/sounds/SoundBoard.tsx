import React from "react";
import { SoundMap, SoundName } from "./model";

export interface SoundBoardProps {
  onPlaySound(sound: SoundName): void;
}

export const SoundBoard = ({ onPlaySound }: SoundBoardProps) => (
  <div>
    {(Object.keys(SoundMap) as any).map((sound: SoundName) => (
      <button
        key={sound}
        className="btn btn-primary"
        onClick={() => onPlaySound(sound)}
      >
        {sound}
      </button>
    ))}
  </div>
);
