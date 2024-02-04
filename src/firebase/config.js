import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkAc7BIhwky6uXzhr3psh3OZ687ckP6tY",
  authDomain: "rental-management-45bc4.firebaseapp.com",
  projectId: "rental-management-45bc4",
  storageBucket: "rental-management-45bc4.appspot.com",
  messagingSenderId: "1026348519809",
  appId: "1:1026348519809:web:f8e3c5717712e351aad880",
};

initializeApp(firebaseConfig);

const db = getFirestore();

export { db };
