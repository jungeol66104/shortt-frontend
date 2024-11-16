import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB7T6T863vNJewR6KiiYjj65BkE569m3qI",
    authDomain: "shortt-f7bfe.firebaseapp.com",
    databaseURL: "https://shortt-f7bfe-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shortt-f7bfe",
    storageBucket: "shortt-f7bfe.firebasestorage.app",
    messagingSenderId: "642287768184",
    appId: "1:642287768184:web:8d5f07e0c4e7a97256138d",
    measurementId: "G-6T899KG6WW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, child, update };
