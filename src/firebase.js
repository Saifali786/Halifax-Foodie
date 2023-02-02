import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

/**
 * @author Meet Master
 */

const firebaseConfig = {
  apiKey: "AIzaSyD3mfK5WcUK3o1nlpiCnUBoYXY66oOYIMQ",
  authDomain: "csci-5410-f2022.firebaseapp.com",
  projectId: "csci-5410-f2022",
  storageBucket: "csci-5410-f2022.appspot.com",
  messagingSenderId: "631975579457",
  appId: "1:631975579457:web:b2949ea3a8a8c7afce5bc0",
  measurementId: "G-1YCM8NSLFW"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}