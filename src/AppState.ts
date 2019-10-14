import { observable, action, computed } from "mobx";
import { Player, PlayerMode } from "./model";

const AnonymousUser: Player = Object.freeze({
  id: "-1",
  displayName: "Anonymous",
  role: "spectator"
});

export class AppState {
  @observable userId: string = null;

  @observable title: string = "JavaScript Quiz Show";

  @computed get contestants(): Player[] {
    return this.players.filter(x => x.role === "contestant");
  }

  @computed
  get view(): PlayerMode {
    return (this.localPlayer || AnonymousUser).role || "spectator";
  }

  @computed get localPlayer(): Player {
    return this.players.find(x => x.id === this.userId);
  }

  @observable buzzedPlayer: Player = null;

  @observable players: Player[] = [
    { id: "0000", displayName: "Presenter", role: "presenter" },
    { id: "1234", displayName: "Jess", role: "moderator" },
    { id: "48129", displayName: "Jane" },
    { id: "68129", displayName: "Jack" },
    {
      id: "21341",
      displayName: "Jessica",
      score: 3400,
      role: "contestant"
    },
    { id: "123", displayName: "Frank", score: 300, role: "contestant" },
    { id: "5512", displayName: "Bombardio", score: 750, role: "contestant" },
    { id: "55142", displayName: "Tony", score: 750, role: "contestant" }
  ];

  @observable currentQuestion: number = 1;

  @observable questionCount: number = 36;

  @action
  readonly addPointsToPlayer = (player: Player, points: number) => {
    player.score = (player.score || 0) + points;
  };

  @action
  readonly contestantBuzzedIn = (player: Player) => {
    this.buzzedPlayer = player;
  };

  @action
  readonly nextSlide = () => {
    this.currentQuestion = Math.min(
      this.questionCount,
      this.currentQuestion + 1
    );
  };

  @action
  readonly prevSlide = () =>
    (this.currentQuestion = Math.max(1, this.currentQuestion - 1));

  @action
  readonly registerUser = (userId: string) => {
    this.userId = userId;
  };

  @action
  readonly setDisplayName = (displayName: string) => {
    this.localPlayer.displayName = displayName;
  };
}
