import React, { useState } from "react";
import { Player, PageProps } from "../model";
import { SoundBoard } from "../sounds/SoundBoard";
import { observer } from "mobx-react-lite";
import "./ModeratorPage.scss";

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
  }: PageProps) => (
    <>
      <div className="players">
        {players.map(player => (
          <PlayerScore
            key={player.id}
            player={player}
            onAddPoints={addPointsToPlayer}
          />
        ))}
      </div>

      <div className="slideButtons">
        <button className="btn btn-secondary" onClick={prevSlide}>
          Prev Slide
        </button>
        <button className="btn btn-secondary" onClick={nextSlide}>
          Next Slide
        </button>
      </div>

      <div className="sounds">
        <SoundBoard onPlaySound={playSound} />
      </div>
    </>
  )
);

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
