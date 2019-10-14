import { AppState } from "./AppState";

export interface Player {
  id?: string;
  displayName: string;
  score?: number;
  role?: PlayerMode;
}

export type PlayerMode = "contestant" | "moderator" | "presenter" | "spectator";

export interface PageProps {
  appState: AppState;
}
