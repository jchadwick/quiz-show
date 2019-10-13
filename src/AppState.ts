import { observable, action } from "mobx";
import { Player } from "./model";

export class AppState {
  @observable players: Player[] = [
    { id: "12314", displayName: "Frank", score: 300 },
    { id: "21342", displayName: "Jessica", score: 3400 },
    { id: "55142", displayName: "Tony", score: 750 }
  ];

  @action
  readonly addPointsToPlayer = (player: Player, points: number) => {
    player.score = (player.score || 0) + points;
  };
}
