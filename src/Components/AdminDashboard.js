import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase'; 
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from 'firebase/auth'; 
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();  
  const location = useLocation();  
  const username = location.state?.username || 'Admin'; 

  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'userRequests')); 
        setTotalUsers(usersSnapshot.size);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const activitySnapshot = await getDocs(collection(db, 'userActivity')); 
        const activityList = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentActivity(activityList);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const notificationsSnapshot = await getDocs(collection(db, 'notifications')); 
        const notificationsList = notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'userRequests'), where('uid', '==', user.uid));
          const userSnapshot = await getDocs(q);
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUserInfo({
              firstName: userData.firstName,
              lastName: userData.lastName,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchTotalUsers();
    fetchRecentActivity();
    fetchNotifications();
    fetchUserInfo();
  }, []);

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
        <h1>Admin Dashboard</h1>
        <div className="navbar-left">
          <span className="user-info-display">Name: {userInfo.firstName} {userInfo.lastName}</span> 
        </div>
        <div className="navbar-right">
          <span className="username-display">Logged in as: {username}</span> 
          <Link to="/report">User Report</Link>
          <Link to="/update">Update Information</Link>
          <button className="logout-button" title = "Button to Logout of account" onClick={handleLogout}>Logout</button> 
        </div>
      </div>

      <div className="container">
        <div className="sidebar">
          <h2>Navigation</h2>
          <Link to="/email">Email</Link>
          <Link to="/create-user">Create a User</Link>
          <Link to="/activation">Activation</Link>
        </div>

        <div className="main-content">
          <h2>Welcome to the Admin Dashboard</h2>
          
          <div className="card">
            <h3>Total Users</h3>
            <p>{totalUsers} users registered</p>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <ul>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <li key={activity.id}>{activity.activity}</li>
                ))
              ) : (
                <p>No recent activity found.</p>
              )}
            </ul>
          </div>

          <div className="card">
            <h3>System Notifications</h3>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id}>{notification.message}</li>
                ))
              ) : (
                <p>No notifications found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
