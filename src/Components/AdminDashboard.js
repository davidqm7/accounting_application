import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import './AdminDashboard.css';
import { Link } from 'react-router-dom'; // Import Link for routing

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch total users from Firestore
    const fetchTotalUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users')); // Assumes a 'users' collection
        setTotalUsers(usersSnapshot.size);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    // Fetch recent activity from Firestore (placeholder for actual data)
    const fetchRecentActivity = async () => {
      try {
        const activitySnapshot = await getDocs(collection(db, 'userActivity')); // Assumes a 'userActivity' collection
        const activityList = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentActivity(activityList);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    // Fetch system notifications from Firestore (placeholder for actual data)
    const fetchNotifications = async () => {
      try {
        const notificationsSnapshot = await getDocs(collection(db, 'notifications')); // Assumes a 'notifications' collection
        const notificationsList = notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchTotalUsers();
    fetchRecentActivity();
    fetchNotifications();
  }, []);

  return (
    <div>
      <div className="navbar">
        <h1>Admin Dashboard</h1>
        <Link to="/report">User Report</Link>
        <Link to="/update">Update Information</Link>
        <Link to="/logout">Logout</Link>
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
