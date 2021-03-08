import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAA1TX5okNugE04iEvST6Z0jdu-8oBpjzU",
    authDomain: "codingscale-aa52f.firebaseapp.com",
    projectId: "codingscale-aa52f",
    storageBucket: "codingscale-aa52f.appspot.com",
    messagingSenderId: "16059410715",
    appId: "1:16059410715:web:cd05cdb86811c907f94bbe",
    measurementId: "G-KL103DH8HV"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

firebase.analytics();