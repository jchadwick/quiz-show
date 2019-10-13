import firebase from "firebase";

let initialized = false;

function initializeFirebase(): void {
  if (initialized) {
    return;
  }

  initialized = true;

  firebase.initializeApp({
    apiKey: "AIzaSyCIw3Il1zFwzWQNONEPpNB5ydnTIYy3mso",
    authDomain: "quizshow-bbe75.firebaseapp.com",
    databaseURL: "https://quizshow-bbe75.firebaseio.com",
    projectId: "quizshow-bbe75",
    storageBucket: "quizshow-bbe75.appspot.com",
    messagingSenderId: "770561928281",
    appId: "1:770561928281:web:66942fd2a6b357f9b15548",
    measurementId: "G-BST52BZV8G"
  });

  firebase.analytics();
}

initializeFirebase();

export * from "./FirebaseUser";
export default firebase;
