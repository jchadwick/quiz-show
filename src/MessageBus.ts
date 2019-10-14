import firebase from "./firebase";

type MessageHandler<T = any> = (message: T) => void;

interface Message<T = any> {
  topic: string;
  body: T;
}

export class MessageBus {
  async clear() {
    await (await this._queue.get()).docs.map(doc =>
      this._queue.doc(doc.id).delete()
    );
  }
  private readonly _subscribers: { [key: string]: MessageHandler[] } = {};
  private readonly _queue: firebase.firestore.CollectionReference;

  constructor() {
    this._queue = firebase.firestore().collection("messages");
  }

  publish<T>(topic: string, message: T) {
    this._queue.add({ topic, body: message } as Message);
    console.debug(`Published ${topic}: `, message);
  }

  subscribe<T>(
    topic: string,
    handler: MessageHandler<T>,
    deleteAfterHandled = false
  ) {
    let subscribers = this._subscribers[topic];

    if (subscribers == null) {
      subscribers = this._subscribers[topic] = [];

      this._queue.where("topic", "==", topic).onSnapshot(snap => {
        snap
          .docChanges()
          .filter(x => x.type === "added")
          .forEach(x => {
            const { body } = x.doc.data();

            this._subscribers[topic].forEach(handler => {
              try {
                handler(body);
              } catch (error) {
                console.warn("Error: ", error);
              }
            });

            if (deleteAfterHandled) {
              this._queue.doc(x.doc.id).delete();
            }
          });
      });
    }

    subscribers.push(handler);
  }

  private static _instance: MessageBus;

  public static get Instance() {
    return (this._instance = this._instance || new MessageBus());
  }
}
