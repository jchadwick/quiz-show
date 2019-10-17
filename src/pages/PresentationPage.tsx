import React from "react";
import { Player, PageProps } from "../model";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { SoundMixer, SoundMixerPlayer } from "../sounds";
import { Slide as CurrentSlide } from "../components/Slide";

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
  const playerId = props && props.player && props.player.id;

  if (playerId == null) {
    return null;
  }

  const id = Number(playerId.replace(/\D/g, ""));
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
    width: "calc(100% - 15rem)"
  },
  playersList: {
    width: "14rem",
    marginRight: "1rem",
    flexDirection: "column",
    justifyContent: "space-around"
  },
  player: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: (props: PlayerViewProps) =>
      props && props.isBuzzedInPlayer ? "gold" : "#060CE9",
    borderRadius: "10%",
    padding: "1em 2em",
    color: (props: PlayerViewProps) =>
      props && props.isBuzzedInPlayer ? "#060CE9" : "#fff",

    "&.buzzed": {
      backgroundColor: "gold",
      color: "#060CE9"
    },

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
  const {
    buzzedPlayerId,
    players,
    currentQuestionId: currentQuestion,
    prevSlide,
    nextSlide
  } = appState;

  React.useEffect(() => {
    const keyPressHandler = ({ key }: { key: string }): any => {
      console.log("key: ", key);
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

  const soundMixer = React.createRef<SoundMixerPlayer>();

  React.useEffect(() => {
    appState.subscribeToSoundEvents(sound => {
      soundMixer.current && soundMixer.current.play(sound);
    });
  }, [appState, soundMixer]);

  return (
    <div className={classes.container}>
      <CurrentSlide className={classes.currentSlide} slide={currentQuestion} />
      <PlayersList players={players} buzzedPlayerId={buzzedPlayerId} />
      <SoundMixer ref={soundMixer} />
    </div>
  );
});

interface PlayersListProps {
  players: Player[];
  buzzedPlayerId: string;
}
const PlayersList = observer(
  ({ players, buzzedPlayerId }: PlayersListProps) => {
    const classes = useStyles();
    return (
      <div className={classes.playersList}>
        {players.map(player => (
          <PlayerView
            key={player.id}
            player={player}
            isBuzzedInPlayer={player.id === buzzedPlayerId}
          />
        ))}
      </div>
    );
  }
);

interface PlayerViewProps {
  player: Player;
  isBuzzedInPlayer: boolean;
}
const PlayerView = observer(({ player, isBuzzedInPlayer }: PlayerViewProps) => {
  const classes = useStyles({ player });
  return (
    <div className={classes.player + (isBuzzedInPlayer ? " buzzed" : "")}>
      <div className="name">{player.displayName}</div>
      <div className="score">{player.score}</div>
    </div>
  );
});
