// ======================================
// FIREBASE CONFIGURATION
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// ======================================
// YOUR FIREBASE PROJECT CONFIG
// ======================================

const firebaseConfig = {

    apiKey: "AIzaSyDMrUVJ4Ydk5TVKK5q8-hxuYJtT-PItBNA",

    authDomain:
        "smart-student-app-cf17a.firebaseapp.com",

    projectId:
        "smart-student-app-cf17a",

    storageBucket:
        "smart-student-app-cf17a.firebasestorage.app",

    messagingSenderId:
        "955126752186",

    appId:
        "1:955126752186:web:060c01b6603cb5a889f383",

    measurementId:
        "G-FE41DF6D6V"
};


// ======================================
// INITIALIZE FIREBASE
// ======================================

const app = initializeApp(firebaseConfig);


// ======================================
// FIREBASE AUTHENTICATION
// ======================================

const auth = getAuth(app);


// ======================================
// FIREBASE REALTIME DATABASE
// ======================================

const db = getDatabase(app);


// ======================================
// EXPORT
// ======================================

export {
    app,
    auth,
    db
};