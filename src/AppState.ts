import {
  observable,
  action,
  computed,
  runInAction,
  toJS,
  reaction
} from "mobx";
import { Player, PlayerMode } from "./model";
import firebase, { FirebaseUser } from "./firebase";
import { MessageBus } from "./MessageBus";
import { SoundName } from "./sounds";

type GameStatus = "registering" | "active" | "done";

interface BuzzerMessage {
  playerId: string;
}

interface PlaySoundMessage {
  sound: SoundName;
}

export class AppState {
  static readonly AnonymousUser: Player = Object.freeze({
    id: "-1",
    displayName: "Anonymous",
    role: "spectator"
  });

  private readonly bus = MessageBus.Instance;
  private playerDocument: firebase.firestore.DocumentReference = null;
  private gameSessionDocument: firebase.firestore.DocumentReference = null;

  readonly players = observable<Player>([]);
  readonly users = observable<Player>([]);

  @observable userId: string = null;
  @observable presenter: string = null;
  @observable moderator: string = null;
  @observable title: string = "JavaScript Quiz Show";
  @observable localPlayer: Player = AppState.AnonymousUser;
  @observable buzzedPlayerId: string = null;
  @observable currentQuestionId: number = 1;
  @observable totalQuestions: number = 36;
  @observable status: GameStatus = "registering";
  @observable private presenterInitialized = false;

  @computed get buzzedPlayer(): Player {
    return this.players.find(x => x.id === this.buzzedPlayerId);
  }

  @computed get isRegisteredPlayer(): boolean {
    return (
      this.localPlayer &&
      this.localPlayer.id !== AppState.AnonymousUser.id &&
      this.localPlayer.displayName != null
    );
  }

  @computed get playerCandidates(): Player[] {
    const specialUserIds = [this.presenter, this.moderator];

    return this.users
      .filter(x => !!x)
      .filter(({ displayName }) => !!displayName)
      .filter(({ id }) => !specialUserIds.includes(id))
      .filter(({ id }) => id !== this.localPlayer.id);
  }

  @computed
  get mode(): PlayerMode {
    if (this.localPlayer.id === AppState.AnonymousUser.id) {
      return "spectator";
    }

    if (this.localPlayer.id === this.presenter) {
      return "presenter";
    }

    if (this.localPlayer.id === this.moderator) {
      return "moderator";
    }

    if (this.players.findIndex(x => x.id === this.localPlayer.id) >= 0) {
      return "contestant";
    }

    return "spectator";
  }

  constructor() {
    this.initialize();

    reaction(
      () => this.mode,
      mode => {
        if (mode === "presenter") {
          this.initializePresenter();
        }
      }
    );
  }

  @action
  readonly addPointsToPlayer = (player: Player, points: number) => {
    if (this.mode !== "moderator") return;
    player.score = (player.score || 0) + points;
    this.updateGameSession({ players: toJS(this.players) });
  };

  @action
  readonly contestantBuzzedIn = (player: Player) => {
    if (player.id === AppState.AnonymousUser.id) return;
    this.bus.publish<BuzzerMessage>("buzzer", { playerId: player.id });
  };

  @action
  readonly playSound = (sound: SoundName) => {
    this.bus.publish<PlaySoundMessage>("play_sound", { sound });
  };

  @action
  readonly nextSlide = () => {
    if (this.mode !== "moderator" && this.mode !== "presenter") return;
    const currentQuestionId = Math.min(
      this.totalQuestions,
      this.currentQuestionId + 1
    );
    this.updateGameSession({ buzzedPlayerId: null, currentQuestionId });
  };

  @action
  readonly prevSlide = () => {
    if (this.mode !== "moderator" && this.mode !== "presenter") return;
    const currentQuestionId = Math.max(1, this.currentQuestionId - 1);
    this.updateGameSession({ currentQuestionId });
  };

  @action
  readonly registerUser = (displayName: string) => {
    this.playerDocument.set({ displayName } as Player, {
      merge: true
    });
  };

  readonly subscribeToSoundEvents = (handler: (sound: SoundName) => void) =>
    this.bus.subscribe<PlaySoundMessage>(
      "play_sound",
      ({ sound }) => handler(sound),
      true
    );

  @action
  readonly toggleContestant = (player: Player) => {
    if (this.mode !== "moderator") return;

    const existingIndex = this.players.findIndex(x => x.id === player.id);

    let players = this.players.slice();

    if (existingIndex > -1) {
      players.splice(existingIndex, 1);
    } else {
      players.push({ ...player, score: 0 });
    }

    this.players.replace(players);

    this.updateGameSession({ players: toJS(players) as any });
  };

  readonly startGame = () => this.updateGameSession({ status: "active" });

  readonly isPlayer = (player: Player) =>
    player && this.players.findIndex(x => x.id === player.id) >= 0;

  private initializePresenter() {
    if (this.presenterInitialized) return;

    this.presenterInitialized = true;

    this.bus.subscribe<BuzzerMessage>("buzzer", ({ playerId }) => {
      if (playerId === AppState.AnonymousUser.id) return;

      if (this.buzzedPlayerId === null) {
        this.updateGameSession({ buzzedPlayerId: playerId });
      } else if (this.buzzedPlayerId === playerId) {
        // you already buzzed in!!
      } else {
        console.info(`Player ${playerId} buzzed in too late!`);
      }
    });
  }

  private async initialize() {
    const user = await FirebaseUser.authenticate();
    this.userId = user.id;

    console.debug(`Authenticated user ${this.userId}`);

    this.initializeCurrentPlayer();

    this.initializeGameSession();

    this.initializeUsers();
  }

  private initializeUsers() {
    firebase
      .firestore()
      .collection("users")
      .onSnapshot(doc => {
        doc.docChanges().forEach(({ doc }) => {
          const existingUser = this.users.find(x => x.id === doc.id);

          runInAction(() => {
            if (existingUser) {
              Object.assign(existingUser, doc.data());
            } else {
              this.users.push(doc.data() as Player);
            }
          });
        });
      });
  }

  private initializeCurrentPlayer() {
    this.playerDocument = getUserDocument(this.userId);

    this.playerDocument.onSnapshot(
      doc => {
        const player = doc.data() as Player;

        if (player == null) {
          console.info(`Registering as new player...`);

          this.playerDocument.set({ id: this.userId } as Player, {
            merge: true
          });

          return;
        }

        console.debug(`Found existing player: ${JSON.stringify(player)}`);

        runInAction(() => {
          if (this.localPlayer.id === player.id) {
            Object.assign(this.localPlayer, player);
          } else {
            this.localPlayer = player;
          }
        });
      },
      error => alert(`Error retrieving user info: ${error}`)
    );
  }

  private async initializeGameSession() {
    this.bus.clear();

    const activeSessionQuery = await firebase
      .firestore()
      .collection(`sessions`)
      .limit(1)
      .get();

    if (activeSessionQuery.size === 0) {
      alert("Couldn't find an active session!");
      return;
    }

    const activeSessionId = activeSessionQuery.docs[0].id;

    this.gameSessionDocument = firebase
      .firestore()
      .doc(`sessions/${activeSessionId}`);

    this.gameSessionDocument.onSnapshot(
      doc => {
        const session = doc.data();

        if (session == null) {
          console.info(`Ignoring null session (this should never happen...)`);
          return;
        }

        runInAction(() => {
          const { players, ...props } = session;

          if (players) {
            this.players.replace(players);
          }

          Object.assign(this, props);
        });
      },
      error => alert(`Error retrieving session: ${error}`)
    );
  }

  private updateGameSession(update: Partial<AppState>): void {
    this.gameSessionDocument.set(update, {
      merge: true
    });
  }
}

const getUserDocument = (userId: string) =>
  firebase.firestore().doc(`users/${userId}`);
