// src/config/firebase.js
import dotenv from "dotenv";
dotenv.config();
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccount = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT)

//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "umg360reu.firebasestorage.app", // ⚠️ cámbialo a tu bucket real
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

export { admin, db, bucket };
