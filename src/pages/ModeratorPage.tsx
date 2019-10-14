import React, { useState } from "react";
import { Player, PageProps } from "../model";
import { SoundBoard } from "../sounds/SoundBoard";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  sounds: {
    flexGrow: 2,
    flexDirection: "row",
    justifyItems: "space-between",

    "& .btn": {
      flexGrow: 1,
      margin: "0.5em"
    }
  },

  slideButtons: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "0.5rem",

    "& .btn": {
      padding: "1em 1.5em"
    }
  },

  players: {
    flexGrow: 3,
    flexDirection: "column"
  },

  player: {
    flexDirection: "column",
    marginBottom: "1rem",

    "& .name": {
      flexGrow: 1,
      fontWeight: 700,
      fontSize: "200%"
    },

    "& .score": {
      flexDirection: "column",
      justifyContent: "center",
      width: "30%",
      color: "#1050db",
      fontWeight: 600
    },

    "& .scoreActions": {
      flexDirection: "row",
      justifyContent: "space-between"
    },

    "& .scoreActions .btn": {
      padding: "2em 1em",
      minWidth: "5em"
    },

    "& .scoreActions input": {
      width: "3em"
    }
  }
});

export const ModeratorPage = observer(({ appState }: PageProps) => {
  return appState.status === "registering" ? (
    <ModerateRegistrationView appState={appState} />
  ) : (
    <ModerateActiveGameView appState={appState} />
  );
});

const ModerateRegistrationView = observer(
  ({
    appState: { users, isPlayer, toggleContestant, startGame }
  }: PageProps) => (
    <>
      <h3>Select Contestants</h3>
      <ul className="list-group">
        {users
          .filter(x => !!x.displayName)
          .map(user => (
            <li
              key={user.id}
              className={
                "list-group-item list-group-item-action " +
                (isPlayer(user) ? " active" : "")
              }
              onClick={() => toggleContestant(user)}
            >
              {user.displayName} <small>({user.id.substr(0, 5)})</small>
            </li>
          ))}
      </ul>

      <div>
        <button className="btn btn-primary" onClick={() => startGame()}>
          Start Game!
        </button>
      </div>
    </>
  )
);

const ModerateActiveGameView = observer(
  ({
    appState: { players, addPointsToPlayer, playSound, prevSlide, nextSlide }
  }: PageProps) => {
    const classes = useStyles();

    return (
      <>
        <div className={classes.players}>
          {players.map(player => (
            <PlayerScore
              key={player.id}
              player={player}
              onAddPoints={addPointsToPlayer}
            />
          ))}
        </div>

        <div className={classes.slideButtons}>
          <button className="btn btn-secondary" onClick={prevSlide}>
            Prev Slide
          </button>
          <button className="btn btn-secondary" onClick={nextSlide}>
            Next Slide
          </button>
        </div>

        <div className={classes.sounds}>
          <SoundBoard onPlaySound={playSound} />
        </div>
      </>
    );
  }
);

interface PlayerScoreProps {
  player: Player;
  onAddPoints(player: Player, points: number): void;
}

const PlayerScore = observer(({ player, onAddPoints }: PlayerScoreProps) => {
  const classes = useStyles();
  const [customScore, setCustomScore] = useState(0);

  return (
    <div className={classes.player}>
      <div className="details">
        <div className="name">{player.displayName}</div>
        <div className="score">
          <div>{player.score}</div>
          <div>
            <form
              onSubmit={evt => {
                onAddPoints(player, customScore);
                setCustomScore(0);
                evt.preventDefault();
              }}
            >
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  value={customScore}
                  onChange={evt => setCustomScore(Number(evt.target.value))}
                />
                <div className="input-group-append">
                  <button
                    type="submit"
                    className="btn btn-outline-secondary addPoints"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="scoreActions">
        {[5, 25, 50, 100].map(points => (
          <button
            key={String(points)}
            className="btn btn-secondary addPoints"
            onClick={() => onAddPoints(player, points)}
          >
            {points}
          </button>
        ))}
        <div className="addPoints"></div>
      </div>
    </div>
  );
});
