import firebase from "firebase";

export class FirebaseUser {
  constructor(readonly credentials: firebase.auth.UserCredential) {}

  get user() {
    return this.credentials && this.credentials.user;
  }

  get id(): string {
    return this.user && this.user.uid;
  }

  get displayName(): string {
    return this.user && this.user.displayName;
  }

  private static _loginRequest: Promise<FirebaseUser> = null;

  static authenticate(): Promise<FirebaseUser> {
    if (this._loginRequest == null) {
      this._loginRequest = firebase
        .auth()
        .signInAnonymously()
        .then(credentials => new FirebaseUser(credentials));

      this._loginRequest.catch(() =>
        console.warn("Unable to authenticate as anonymous user")
      );
    }

    return this._loginRequest;
  }
}
