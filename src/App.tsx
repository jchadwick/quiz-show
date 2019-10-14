import React, { FunctionComponent } from "react";
import { AnonymousPage } from "./pages/AnonymousPage";
import { ContestantPage } from "./pages/ContestantPage";
import { ModeratorPage } from "./pages/ModeratorPage";
import { PresentationPage } from "./pages/PresentationPage";
import { AppState } from "./AppState";
import { useLocalStore, observer } from "mobx-react-lite";
import "./App.scss";
import { PageProps, PlayerMode } from "./model";

const routes: {
  [key in PlayerMode]: FunctionComponent<PageProps>;
} = {
  contestant: ContestantPage,
  moderator: ModeratorPage,
  presenter: PresentationPage,
  spectator: AnonymousPage
};

const App = observer(() => {
  const state = useLocalStore(() => new AppState());
  const View = routes[state.view];

  return (
    <div className="App">
      <View appState={state} />
    </div>
  );
});

export default App;
