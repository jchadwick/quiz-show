import React from "react";
import { createUseStyles } from "react-jss";
import { PageProps } from "../model";
import { observer } from "mobx-react-lite";
import { Slide } from "../components/Slide";

const useStyles = createUseStyles({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  content: {
    flexGrow: 1,
    flexDirection: "column"
  },
  title: {
    fontSize: "200%",
    fontWeight: 800,
    textAlign: "center",
    padding: "1em"
  },
  registrationForm: {
    display: "flex",
    flexDirection: "column"
  }
});

export const AnonymousPage = observer(({ appState }: PageProps) =>
  appState.status === "registering" ? (
    <AnonymousRegistrationView appState={appState} />
  ) : (
    <AnonymousActiveGameView appState={appState} />
  )
);

const useActiveGameStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  slide: {
    maxHeight: "100vh",
    maxWidth: "100vw"
  }
});

const AnonymousActiveGameView = observer(({ appState }: PageProps) => {
  const classes = useActiveGameStyles();

  return (
    <div className={classes.container}>
      <Slide className={classes.slide} slide={appState.currentQuestionId} />
      <div>Game in progress...</div>

      <small>
        {appState.userId && <em>User ID: {appState.userId.substr(0, 5)}</em>}
      </small>
    </div>
  );
});

const AnonymousRegistrationView = observer(({ appState }: PageProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.title}>{appState.title}</div>
      <div className={classes.content}>
        {appState.isRegisteredPlayer ? (
          <RegisteredWaitingView appState={appState} />
        ) : (
          <RegistrationPage appState={appState} />
        )}
      </div>
    </div>
  );
});

const RegistrationPage = ({ appState: { registerUser } }: PageProps) => {
  const classes = useStyles();
  const [playerName, setPlayerName] = React.useState("");
  const canSubmit = (playerName || "").length > 3;

  return (
    <div className={classes.container}>
      <div>Please sign in:</div>
      <form
        className={classes.registrationForm}
        onSubmit={evt => {
          evt.preventDefault();

          if (canSubmit) {
            registerUser(playerName);
          }
        }}
      >
        <input
          type="text"
          placeholder="What's your name?"
          value={playerName}
          onChange={evt => setPlayerName(evt.target.value)}
        />
        <button disabled={!canSubmit} className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

const RegisteredWaitingView = observer(
  ({ appState: { localPlayer } }: PageProps) => (
    <>
      <div>Welcome, {localPlayer.displayName}!</div>
      <div>The game will begin shortly...</div>
      <small>
        <em>User ID: {localPlayer.id.substr(0, 5)}</em>
      </small>
    </>
  )
);
