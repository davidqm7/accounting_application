import React from 'react';
import { signOut } from 'firebase/auth'; 
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import { auth } from '../firebase'; 
import './RegularDashboard.css';

const RegularDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || 'User';  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');  
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>Regular Dashboard</h1>
        <div className="navbar-right">
          <span className="username-display">Logged in as: {username}</span>
          <Link to="#" onClick={handleLogout}>Logout</Link>  
        </div>
      </div>

      <div className="container">
        <div className="sidebar">
          <h2>Navigation</h2>
          <Link to="/reg-get-email">Read Messages</Link>
          <Link to="/regular-user-report">User Report</Link> 
          <Link to="">...</Link>
          <Link to="">...</Link>
        </div>

        <div className="main-content">
          <h2>Welcome to the Regular Dashboard</h2>
        </div>
      </div>
    </div>
  );
};

export default RegularDashboard;
