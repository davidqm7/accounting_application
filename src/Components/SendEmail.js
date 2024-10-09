import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';  // Adjust the import path as necessary
import './SendEmail.css'; // Make sure to import the CSS file



const SendEmail = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'userRequests')); // Assuming 'users' collection
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email sent to ${selectedUserEmail}! Subject: ${emailSubject}, Message: ${emailMessage}`);
    // Here, you would implement the actual email sending functionality using your server or a service like SendGrid.

  };

  return (
    <div className="send-email-container">
      <h1>Admin Dashboard - Send Email</h1>
      <div className="section">
        <h2>Send Email to User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userEmail">Select User</label>
            <select 
              id="userEmail" 
              name="userEmail" 
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)} 
              required
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.email}>{user.email}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="emailSubject">Email Subject</label>
            <input 
              type="text" 
              id="emailSubject" 
              name="emailSubject" 
              value={emailSubject} 
              onChange={(e) => setEmailSubject(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="emailMessage">Message</label>
            <textarea 
              id="emailMessage" 
              name="emailMessage" 
              value={emailMessage} 
              onChange={(e) => setEmailMessage(e.target.value)} 
              required
            ></textarea>
          </div>

          <button type="submit" title = "Sends the email" >Send Email</button>
        </form>
      </div>
    </div>
  );
};

export default SendEmail;
