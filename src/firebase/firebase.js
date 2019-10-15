import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyD-uQ268Y4n-QW12Xzw1QlYk18FX4nVlVQ",
    authDomain: "events-6df1e.firebaseapp.com",
    databaseURL: "https://events-6df1e.firebaseio.com",
    projectId: "events-6df1e",
    storageBucket: "events-6df1e.appspot.com",
    messagingSenderId: "46056928999",
    appId: "1:46056928999:web:b2df867e8771dd614e1442",
    measurementId: "G-R78H6CHVKX"
};

firebase.initializeApp(config);
const database = firebase.database();

export {firebase,database as default};