import React from "react";
import { createUseStyles } from "react-jss";
import { PageProps } from "../model";
import { observer } from "mobx-react-lite";

const useStyles = createUseStyles({
  container: {
    flexDirection: "column",
    alignItems: "center"
  },
  content: {
    flexDirection: "column",
    flexGrow: 4
  },
  title: {
    flexGrow: 1,
    fontSize: "200%",
    fontWeight: 800,
    textAlign: "center"
  }
});

export const AnonymousPage = observer(({ appState }: PageProps) =>
  appState.status === "registering" ? (
    <AnonymousRegistrationView appState={appState} />
  ) : (
    <AnonymousActiveGameView />
  )
);

const AnonymousActiveGameView = observer(() => <div>Game in progress...</div>);

const AnonymousRegistrationView = observer(
  ({
    appState: { title, isRegisteredPlayer, registerUser, localPlayer }
  }: PageProps) => {
    const classes = useStyles();
    const [playerName, setPlayerName] = React.useState("");
    const canSubmit = (playerName || "").length > 3;

    return (
      <div className={classes.container}>
        <div className={classes.title}>{title}</div>
        <div className={classes.content}>
          {isRegisteredPlayer ? (
            <div>
              <div>Welcome, {localPlayer.displayName}!</div>
              <div>The game will begin shortly...</div>
            </div>
          ) : (
            <>
              <div>Please sign in:</div>
              <form
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
            </>
          )}
        </div>
      </div>
    );
  }
);
