import { initializeApp } from "firebase/app";
import getFirestore from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzzSJLwus3mwHOXrlKa10Ki2oPzgoKhB8",
  authDomain: "memoorize-faf57.firebaseapp.com",
  projectId: "memoorize-faf57",
  storageBucket: "memoorize-faf57.appspot.com",
  messagingSenderId: "125332279530",
  appId: "1:125332279530:web:950557af79328015700793"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
