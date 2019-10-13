import React from "react";
import { Player, PageProps } from "../model";
import { observer, useLocalStore } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    flexDirection: "row",
    flexGrow: 1
  },
  currentSlide: {
    justifyContent: "center",
    alignItems: "center",
    width: "calc(100% - 10rem)"
  },
  playersList: {
    width: "10rem",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  player: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export const PresentationPage = observer(
  ({ appState: { players } }: PageProps) => {
    const classes = useStyles();
    const state = useLocalStore(() => ({
      currentSlide: 1,
      slideCount: 36,
      nextSlide() {
        this.currentSlide = Math.min(this.slideCount, this.currentSlide + 1);
      },
      prevSlide() {
        this.currentSlide = Math.max(1, this.currentSlide - 1);
      }
    }));

    React.useEffect(() => {
      const keyPressHandler = ({ key }: { key: string }): any => {
        switch (key) {
          case "ArrowLeft":
            state.prevSlide();
            break;
          case "ArrowRight":
            state.nextSlide();
            break;
        }
      };

      document.addEventListener("keydown", keyPressHandler);
      return () => {
        document.removeEventListener("keydown", keyPressHandler);
      };
    }, [state]);

    return (
      <div className={classes.container}>
        <CurrentSlide slide={state.currentSlide} />
        <PlayersList players={players} />
      </div>
    );
  }
);

interface CurrentSlideProps {
  slide: number;
}

const CurrentSlide = ({ slide }: CurrentSlideProps) => {
  const classes = useStyles();
  return (
    <div className={classes.currentSlide}>
      <img
        alt={`Slide${slide}.jpg`}
        src={`/slides/Slide${slide}.jpg`}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

interface PlayersListProps {
  players: Player[];
}
const PlayersList = ({ players }: PlayersListProps) => {
  const classes = useStyles();
  return (
    <div className={classes.playersList}>
      {players.map(player => (
        <PlayerView key={player.id} player={player} />
      ))}
    </div>
  );
};

interface PlayerViewProps {
  player: Player;
}
const PlayerView = ({ player }: PlayerViewProps) => {
  const classes = useStyles();
  return (
    <div className={classes.player}>
      <div className="name">{player.displayName}</div>
      <div className="score">{player.score}</div>
    </div>
  );
};
