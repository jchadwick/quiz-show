import { AppState } from "./AppState";

export interface Player {
  id?: string;
  displayName: string;
  score?: number;
}

export interface PageProps {
  appState: AppState;
}
