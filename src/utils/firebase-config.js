import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBUI-BUm6Q-Boo0DSjtORubC5nj00Ac7DM",
  authDomain: "react-netflix-clone-9747a.firebaseapp.com",
  projectId: "react-netflix-clone-9747a",
  storageBucket: "react-netflix-clone-9747a.appspot.com",
  messagingSenderId: "666466353079",
  appId: "1:666466353079:web:0c1fa4b764242b1ff43232",
  measurementId: "G-7V4K28C8CV"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);