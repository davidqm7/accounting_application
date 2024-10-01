import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';  // Adjust the import path as necessary
import './ManagerGetEmail.css'; // Make sure to import the CSS file



const ManagerGetEmail = () => {
  


  return (
    <div className="send-email-container">
      <h1>Manager Messages</h1>
      <div className="section">
        
      </div>
    </div>
  );
};

export default ManagerGetEmail;