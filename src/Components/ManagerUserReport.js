import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../firebase'; 
import './ManagerUserReport.css';

const ManagerUserReport = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'userRequests');  
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="manager-user-report-container">
      <h1>Manager User Report</h1>

      <div className="section">
        <h2>User Summary</h2>
        <div className="summary-card">
          <div>
            <h3>Total Users</h3>
            <p><strong>{users.length}</strong> users</p>
          </div>
          <i className="fas fa-users"></i>
        </div>
      </div>

      <div className="section">
        <h2>All Users</h2>
        <div className="user-list">
          {users.map(user => (
            <div className="user-card" key={user.id}>
              <div className="user-details">
                <strong>Username:</strong> {user.firstName} {user.lastName}<br />
                <strong>Email:</strong> {user.email}<br />
                <strong>Role:</strong> {user.role}<br />
                <strong>Status:</strong> {user.status ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerUserReport;
