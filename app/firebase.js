// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyD0baZKibYdsgEmrWb5FruEI0ZjuRe91F4",
  authDomain: "purrfectplatectu-9f610.firebaseapp.com",
  projectId: "purrfectplatectu-9f610",
  storageBucket: "purrfectplatectu-9f610.appspot.com",
  messagingSenderId: "374428637829",
  appId: "1:374428637829:web:565f27756eb144c84167ec",
  measurementId: "G-W7NR1QYZK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };