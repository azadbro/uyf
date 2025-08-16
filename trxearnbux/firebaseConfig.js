import admin from "firebase-admin";

// 🔑 service account JSON (tumhari uploaded file se)
import serviceAccount from "./wtf-bot-76db0-firebase-adminsdk-fbsvc-0fb5daed2f.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wtf-bot-76db0-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
}

export const db = admin.database();

// Client Firebase config (frontend ke liye)
export const clientFirebaseConfig = {
  apiKey: "AIzaSyA-_vi1FNzhGxilWO_OdOwDGXWL61TJoGc",
  authDomain: "wtf-bot-76db0.firebaseapp.com",
  databaseURL: "https://wtf-bot-76db0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wtf-bot-76db0",
  storageBucket: "wtf-bot-76db0.appspot.com",
  messagingSenderId: "989099973878",
  appId: "1:989099973878:web:14eda1959934383e6820d7",
  measurementId: "G-R7K39J3XEK"
};
