// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoyJZUyg9kf-Mt1-S8qztlpPxvzTpIgHM",
  authDomain: "are-z-pak.firebaseapp.com",
  projectId: "are-z-pak",
  storageBucket: "are-z-pak.firebasestorage.app",
  messagingSenderId: "42519679047",
  appId: "1:42519679047:web:303ab311a5a2aca705a162"
};

initializeApp(firebaseConfig);

const database = firebase.database();

export { database };