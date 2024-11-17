import { getFirestore } from "firebase/firestore";

import { initializeApp } from "firebase/app";


import {getAuth} from 'firebase/auth'; 



const firebaseConfig = {

  apiKey: "AIzaSyASGd_m88H_qVt3WbZT0pnXYc3911RsCa8", //process.env.REACT_APP_FIREBASE_API_KEY

  authDomain: "swe4713-accounting-application.firebaseapp.com",

  projectId: "swe4713-accounting-application",

  storageBucket: "swe4713-accounting-application.appspot.com",

  messagingSenderId: "49319612085",

  appId: process.env.REACT_APP_FIREBASE_APP_ID, //process.env.REACT_APP_FIREBASE_APP_ID

  measurementId: "G-M12DWCCL8T"

};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 

const db = getFirestore(app);


export {auth ,db}; 