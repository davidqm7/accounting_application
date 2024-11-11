import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth'; 
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import { auth, db } from '../firebase'; 
import { collection, getDocs, query, where } from "firebase/firestore";
import './RegularDashboard.css';

const RegularDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || 'User';  

  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userRef = collection(db, 'userRequests');
        const q = query(userRef, where('username', '==', username));
        const userSnapshot = await getDocs(q);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserInfo({ firstName: userData.firstName, lastName: userData.lastName });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [username]);

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
        <div className="navbar-left">
          <span className="user-info-display">Name: {userInfo.firstName} {userInfo.lastName}</span> 
        </div>
        <div className="navbar-right">
          <span className="username-display">Logged in as: {username}</span>
          <Link to="#" onClick={handleLogout}>Logout</Link>  
        </div>
      </div>

      <div className="container">
        <div className="sidebar">
          <h2>Navigation</h2>
          <Link to="/email">Email</Link>
          <Link to="/reg-get-email">Read Messages</Link>
          <Link to="/event-log">Event Log</Link>
          <Link to="/regular-user-report">Chart of Accounts</Link> 
          <Link to="/user-journalizing/:entryId">Journalizing</Link>
          <Link to="/general-ledger">General Ledger</Link>
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
