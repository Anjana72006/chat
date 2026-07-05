import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAft50K7Voz57Lh0ckviTdippcn3KrmIVI",
  authDomain: "chat-app-3e6e1.firebaseapp.com",
  projectId: "chat-app-3e6e1",
  storageBucket: "chat-app-3e6e1.firebasestorage.app",
  messagingSenderId: "630567055214",
  appId: "1:630567055214:web:88037f6dfe1a4838b19b7f"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);