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

function getMail(){
  return firebase.auth().currentUser.email
}

async function getUser(){
  var email = getMail()
  var doc = await firebase.firestore().collection("users").doc(email).get()
  return doc.data().name
}

export const getToken = (setTokenFound) => {
  return firebase.messaging().getToken({vapidKey: 'BE-BOIhqlUHoDqQhJgZ8WeI7NFMuZPWg4XDRFgbX1dEyarTcDnFpCoKg2EDCi9n8SJFATn57tz_ezZCMHGw1kcw'}).then((currentToken) => {
    if (currentToken) {
      // console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      // console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}


export const fbase = firebase
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const getUserName = getUser;
export const getUserMail = getMail;
export const messaging = firebase.messaging();
