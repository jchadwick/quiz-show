import React from "react";
import { Player, PageProps } from "../model";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

const fontFamilies = [
  "Cedarville Cursive",
  "Permanent Marker",
  "Reenie Beanie",
  "Rock Salt"
  //"Ruge Boogie"
];

const getPlayerFontSize = (props: { player: Player }) => {
  const name = (props && props.player && props.player.displayName) || "x";
  return `${300 - name.length * 20}%`;
};

const getPlayerFontFamily = (props: { player: Player }) => {
  const id = Number(
    ((props && props.player && props.player.id) || "0").replace(/^\D+/g, "")
  );
  console.log(
    props,
    `id: ${id}; ${id % fontFamilies.length}; ${
      fontFamilies[id % fontFamilies.length]
    }`
  );
  return fontFamilies[id % fontFamilies.length];
};

const useStyles = createUseStyles({
  container: {
    flexDirection: "row",
    flexGrow: 1
  },
  currentSlide: {
    justifyContent: "center",
    alignItems: "center",
    width: "calc(100% - 13rem)"
  },
  playersList: {
    width: "13rem",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  player: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#060CE9",
    borderRadius: "10%",
    padding: "1em 2em",
    color: "#fff",

    "& .name": {
      fontFamily: getPlayerFontFamily,
      fontSize: getPlayerFontSize
    },

    "& .score": {
      fontSize: "150%"
    }
  }
});

export const PresentationPage = observer(({ appState }: PageProps) => {
  const classes = useStyles();
  const { contestants, currentQuestion, prevSlide, nextSlide } = appState;

  React.useEffect(() => {
    const keyPressHandler = ({ key }: { key: string }): any => {
      switch (key) {
        case "ArrowLeft":
          prevSlide();
          break;
        case "ArrowRight":
          nextSlide();
          break;
      }
    };

    document.addEventListener("keydown", keyPressHandler);
    return () => {
      document.removeEventListener("keydown", keyPressHandler);
    };
  }, [nextSlide, prevSlide]);

  return (
    <div className={classes.container}>
      <CurrentSlide slide={currentQuestion} />
      <PlayersList players={contestants} />
    </div>
  );
});

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
  const classes = useStyles({ player });
  return (
    <div className={classes.player}>
      <div className="name">{player.displayName}</div>
      <div className="score">{player.score}</div>
    </div>
  );
};
