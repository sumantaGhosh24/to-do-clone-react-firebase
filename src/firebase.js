import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = firebase.initializeApp({
  // firebase config
});

export {firebaseConfig as firebase};
