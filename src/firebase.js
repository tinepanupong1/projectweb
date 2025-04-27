// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0k8a3W3f6Ey90s4KEH_nrvdlHxrLo0tc",
  authDomain: "projectauthentication-f9091.firebaseapp.com",
  projectId: "projectauthentication-f9091",
  storageBucket: "projectauthentication-f9091.appspot.com",
  messagingSenderId: "731506531014",
  appId: "1:731506531014:web:1c2e116356b9313d8e95c7"
};

// ✅ สร้าง app และ db
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ export ทั้งสอง
export { app, db };
