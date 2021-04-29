// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBIocAZ_XvJNHlqATpH3qYf4K59KcdAYOY",
    authDomain: "socialmedia-35079.firebaseapp.com",
    projectId: "socialmedia-35079",
    storageBucket: "socialmedia-35079.appspot.com",
    messagingSenderId: "810220143430",
    appId: "1:810220143430:web:11929f4409f779730b1b47",
    measurementId: "G-9PG92KL3ZC",
});


// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

