// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  //apiKey: "AIzaSyASGd_m88H_qVt3WbZT0pnXYc3911RsCa8",

  authDomain: "swe4713-accounting-application.firebaseapp.com",

  projectId: "swe4713-accounting-application",

  storageBucket: "swe4713-accounting-application.appspot.com",

  messagingSenderId: "49319612085",

 // appId: "1:49319612085:web:1d9632e3e0d930859578fc",

  measurementId: "G-M12DWCCL8T"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);