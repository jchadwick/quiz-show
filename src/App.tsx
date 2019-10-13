import React from "react";
import { ModeratorPage } from "./pages/ModeratorPage";
import { PresentationPage } from "./pages/PresentationPage";
import { AppState } from "./AppState";
import { useLocalStore, observer } from "mobx-react-lite";
import "./App.scss";

const routes = {
  moderator: ModeratorPage,
  projector: PresentationPage
};

const App = observer(() => {
  const state = useLocalStore(() => new AppState());

  const View = routes.projector;

  return (
    <div className="App">
      <View appState={state} />
    </div>
  );
});

export default App;
