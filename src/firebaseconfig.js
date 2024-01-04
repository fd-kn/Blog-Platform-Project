import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCzkw1vUoxhyH9C8j9tJTwTOVWtXjj4pDE",
  authDomain: "blog-platform-c3a9a.firebaseapp.com",
  projectId: "blog-platform-c3a9a",
  storageBucket: "blog-platform-c3a9a.appspot.com",
  messagingSenderId: "558695969411",
  appId: "1:558695969411:web:170ab2d74da466930961b6",
  measurementId: "G-C3GW572HCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);


export {db,auth,storage}