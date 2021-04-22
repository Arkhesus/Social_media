import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBIocAZ_XvJNHlqATpH3qYf4K59KcdAYOY",
    authDomain: "socialmedia-35079.firebaseapp.com",
    projectId: "socialmedia-35079",
    storageBucket: "socialmedia-35079.appspot.com",
    messagingSenderId: "810220143430",
    appId: "1:810220143430:web:11929f4409f779730b1b47",
    measurementId: "G-9PG92KL3ZC",
  }

firebase.initializeApp(firebaseConfig);

async function getUser(){
  var email = getMail()
  var doc = await firebase.firestore().collection("users").doc(email).get()
  return doc.data().name
}

function getMail(){
  return firebase.auth().currentUser.email
}

export const fbase = firebase
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const getUserName = getUser;
export const getUserMail = getMail;
