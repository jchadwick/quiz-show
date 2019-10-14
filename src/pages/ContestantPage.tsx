import React from "react";
import { PageProps } from "../model";
import { createUseStyles } from "react-jss";

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

export const ContestantPage = ({
  appState: { localPlayer: contestant, contestantBuzzedIn }
}: PageProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.playerDetails}>
        <div className={classes.playerName}>{contestant.displayName}</div>
        <div className={classes.score}>{contestant.score}</div>
      </div>
      <button
        className={classes.buzzer + " btn btn-secondary"}
        onClick={() => contestantBuzzedIn(contestant)}
      >
        Buzz
      </button>
    </div>
  );
};
