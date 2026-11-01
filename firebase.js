import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBymLPHlcfJWG1yenQH04KAv-Wig8NaEX8",
  authDomain: "mitra-e9a64.firebaseapp.com",
  projectId: "mitra-e9a64",
  storageBucket: "mitra-e9a64.firebasestorage.app",
  messagingSenderId: "1093452297580",
  appId: "1:1093452297580:web:fd04a5db2b60831a9daf49"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

console.log("Mitra Firebase Connected");