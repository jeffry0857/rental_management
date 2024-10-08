import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
// import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDkAc7BIhwky6uXzhr3psh3OZ687ckP6tY",
  authDomain: "rental-management-45bc4.firebaseapp.com",
  projectId: "rental-management-45bc4",
  storageBucket: "rental-management-45bc4.appspot.com",
  messagingSenderId: "1026348519809",
  appId: "1:1026348519809:web:f8e3c5717712e351aad880",
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
