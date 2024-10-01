import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import './Activation.css'; 

const Activation = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'userRequests'));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const generateUsername = (firstName, lastName, createdAt) => {
    const firstInitial = firstName.charAt(0).toLowerCase();
    const lastNameLower = lastName.toLowerCase();
    const creationDate = new Date(createdAt.seconds * 1000);
    const month = ("0" + (creationDate.getMonth() + 1)).slice(-2);
    const year = creationDate.getFullYear().toString().slice(-2); 

    return `${firstInitial}${lastNameLower}${month}${year}`;
  };

  const sendActivationEmail = async (email, firstName, username) => {
    try {
      const response = await fetch('http://localhost:5000/send-activation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, username })
      });

      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';

    if (newStatus === 'Active' && !user.username) {
      const generatedUsername = generateUsername(user.firstName, user.lastName, user.createdAt);

      try {
        await updateDoc(doc(db, 'userRequests', user.id), { 
          status: newStatus, 
          username: generatedUsername 
        });
        sendActivationEmail(user.email, user.firstName, generatedUsername);
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: newStatus, username: generatedUsername } : u
        ));
      } catch (error) {
        console.error("Error updating user status and username:", error);
      }
    } else {
      try {
        await updateDoc(doc(db, 'userRequests', user.id), { status: newStatus });
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  };

  return (
    <div className="activation-container">
      <h1>Admin User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username || 'N/A'}</td> 
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className={`status ${user.status.toLowerCase()}`}>{user.status}</td>
              <td>
                <button 
                  className={`toggle-button ${user.status === 'Active' ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleStatus(user)}
                >
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activation;
