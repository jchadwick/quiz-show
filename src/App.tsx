import React, { FunctionComponent } from "react";
import { AnonymousPage } from "./pages/AnonymousPage";
import { ContestantPage } from "./pages/ContestantPage";
import { ModeratorPage } from "./pages/ModeratorPage";
import { PresentationPage } from "./pages/PresentationPage";
import { SplashPage } from "./pages/SplashPage";
import { AppState } from "./AppState";
import { useLocalStore, observer } from "mobx-react-lite";
import { PageProps, PlayerMode } from "./model";

const routes: {
  [key in PlayerMode]: FunctionComponent<PageProps>;
} = {
  initializing: SplashPage,
  contestant: ContestantPage,
  moderator: ModeratorPage,
  presenter: PresentationPage,
  spectator: AnonymousPage
};

const App = observer(() => {
  const state = useLocalStore(() => new AppState());
  const View = routes[state.mode];

  return <View appState={state} />;
});

export default App;
