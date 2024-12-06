import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc, addDoc, Timestamp } from "firebase/firestore"; 
import { db } from '../firebase'; 
import { getAuth } from "firebase/auth"; 
import './Activation.css'; 

const Activation = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const auth = getAuth(); // Get the authentication instance

  useEffect(() => {
    // Fetch all user requests from Firestore when the component mounts
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

  // Generate a unique username based on the user's first name, last name, and account creation date
  const generateUsername = (firstName, lastName, createdAt) => {
    const firstInitial = firstName.charAt(0).toLowerCase();
    const lastNameLower = lastName.toLowerCase();
    const creationDate = new Date(createdAt.seconds * 1000);
    const month = ("0" + (creationDate.getMonth() + 1)).slice(-2);
    const year = creationDate.getFullYear().toString().slice(-2);

    return `${firstInitial}${lastNameLower}${month}${year}`;
  };

   // Send an activation email using the backend email endpoint
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

  // Check the user's account balance in the userAccounts collection
  const checkUserBalance = async (userId) => {
    try {
      // Check user balance in userAccounts collection
      const accountDoc = await getDoc(doc(db, 'userAccounts', userId));
      if (accountDoc.exists()) {
        const userAccount = accountDoc.data();
        return userAccount.balance || 0;
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
    return 0;
  };

  // Log any changes to the user's status in the event log collection
  const logStatusChange = async (username, newStatus) => {
    try {
      const currentUser = auth.currentUser; 
      const changedBy = currentUser ? currentUser.uid : "BjHOKaqXIjflNTJLmBVkNprF4JI2"; 

      const messageString = `User ${username} status changed to ${newStatus}`;
      const messageTime = Timestamp.now();

      await addDoc(collection(db, 'eventLogMessages'), {
        messageString,
        messageTime,
        changedBy 
      });
    } catch (error) {
      console.error('Error logging status change:', error);
    }
  };

   // Toggle a user's status between Active and Inactive
  const toggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setErrorMessage('');

    if (newStatus === 'Inactive') {
      
      const userBalance = await checkUserBalance(user.id);
      if (userBalance > 0) {
        setErrorMessage(`User cannot be deactivated because they have a balance of $${userBalance}.`);
        return;
      }
    }

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

        logStatusChange(generatedUsername, newStatus);
      } catch (error) {
        console.error("Error updating user status and username:", error);
      }
    } else {
      try {
        await updateDoc(doc(db, 'userRequests', user.id), { status: newStatus });
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));

        logStatusChange(user.username, newStatus);
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  };

  return (
    <div className="activation-container">
      <h1>Admin User Management</h1>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

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





