import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';  // Adjust the import path as necessary
import './RegularGetEmail.css'; // Make sure to import the CSS file



const RegularGetEmail = () => {
  


  return (
    <div className="send-email-container">
      <h1>Regular User Messages</h1>
      <div className="section">
        
      </div>
    </div>
  );
};

export default RegularGetEmail;
