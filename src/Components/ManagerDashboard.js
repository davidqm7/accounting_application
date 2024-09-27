import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { doc, getDoc } from "firebase/firestore"; 
import { db } from '../firebase'; 
import { Link } from 'react-router-dom'; // Import Link for routing
import './ManagerDashboard.css';

const ManagerDashboard = () => {


    return (
     <div>

      <div className="navbar">
        <h1>Manager Dashboard</h1>
        <Link to="/logout">Logout</Link>
      </div>

      <div className="container">
        <div className="sidebar">
          <h2>Navigation</h2>
          <Link to="">...</Link>
          <Link to="">...</Link>
          <Link to="">...</Link>
        </div>
        </div>

        <div className="main-content">
          <h2>Welcome to the Manager Dashboard</h2>
        </div>

      </div>
 
    );

};
export default ManagerDashboard;