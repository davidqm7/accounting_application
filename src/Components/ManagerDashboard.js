import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth'; 
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import { auth, db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || 'Manager';  

  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });

  // Fetch first and last name from Firestore (userRequests collection)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userSnapshot = await getDocs(
          query(collection(db, 'userRequests'), where('username', '==', username))
        );
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data(); 
          setUserInfo({
            firstName: userData.firstName,
            lastName: userData.lastName,
          });
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
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
        <h1>Manager Dashboard</h1>
        <div className="navbar-right">
          <span className="username-display">Logged in as: {username}</span>
          <Link to="#" onClick={handleLogout}>Logout</Link> 
        </div>
      </div>

      <div className="container">
        <div className="sidebar">
          <h2>Navigation</h2>
          <Link to="/email">Email</Link>
          <Link to="/manager-get-email">Read Messages</Link>
          <Link to="/event-log">Event Log</Link>
          <Link to="/manager-user-report">Chart of Accounts</Link>  
          <Link to="/user-journalizing/:entryId">Journalizing</Link>
          <Link to="/manager-journalizing">Journal Entries</Link>
          <Link to="/general-ledger">General Ledger</Link>
          <Link to="/trial-balance">Trial Balance</Link>
          <Link to="/income-statement">Income Statement</Link>
          <Link to="/balance-sheet">Balance Sheet</Link>
          <Link to="/retained-earnings-statement">Retained Earnings Statement</Link>
          
          <Link to="">...</Link>
        </div>

        <div className="main-content">
          <h2>Welcome to the Manager Dashboard</h2>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
