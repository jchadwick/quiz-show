import React from "react";
import { PageProps } from "../model";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";

const useStyles = createUseStyles({
  container: {
    flexGrow: 1,
    flexDirection: "column"
  },
  playerDetails: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around"
  },
  playerName: {
    fontSize: "200%"
  },
  score: {
    fontSize: "150%"
  },
  buzzer: {
    flexGrow: 4,
    fontVariant: "all-small-caps",
    fontSize: "400%"
  }
});

export const ContestantPage = observer(({ appState }: PageProps) =>
  appState.status === "registering" ? (
    <RegisteredContestantView appState={appState} />
  ) : (
    <ActiveContestantView appState={appState} />
  )
);

export const RegisteredContestantView = observer(
  ({ appState: { localPlayer, title } }: PageProps) => (
    <>
      <div>
        Congratulations, {localPlayer.displayName}, you're a contestant on
        <span>{title}</span>!
      </div>
      <div>Hold tight - the game will begin shortly!</div>
    </>
  )
);

export const ActiveContestantView = observer(
  ({ appState, appState: { localPlayer, contestantBuzzedIn } }: PageProps) => {
    const classes = useStyles();

    return (
      <div className={classes.container}>
        <div className={classes.playerDetails}>
          <div className={classes.playerName}>{localPlayer.displayName}</div>
          <div className={classes.score}>{localPlayer.score}</div>
        </div>
        <button
          className={classes.buzzer + " btn btn-secondary"}
          onClick={() => contestantBuzzedIn(localPlayer)}
        >
          Buzz
        </button>
        <small>
          <em>User ID: {appState.userId}</em>
        </small>
      </div>
    );
  }
);
