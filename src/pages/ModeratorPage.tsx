import React, { useState } from "react";
import { Player, PageProps } from "../model";
import { observer } from "mobx-react-lite";
import "./ModeratorPage.scss";

export const ModeratorPage = observer(({ appState: state }: PageProps) => {
  return (
    <>
      <div className="players">
        {state.players.map(player => (
          <PlayerScore
            key={player.id}
            player={player}
            onAddPoints={state.addPointsToPlayer}
          />
        ))}
      </div>

      <div className="sounds">
        <button className="btn btn-success">Right</button>
        <button className="btn btn-danger">Wrong</button>
      </div>
    </>
  );
});

interface PlayerScoreProps {
  player: Player;
  onAddPoints(player: Player, points: number): void;
}

const PlayerScore = observer(({ player, onAddPoints }: PlayerScoreProps) => {
  const [customScore, setCustomScore] = useState(0);

  return (
    <div className="player">
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
