import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { auth, db } from '../firebase'; 
import { useNavigate } from 'react-router-dom';
import { query, collection, where, getDocs } from 'firebase/firestore'; // Import Firestore query methods
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState(''); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Update email state when the email input field changes
  const handleChangeEmail = (e) => setEmail(e.target.value);
  // Update username state when the username input field changes
  const handleChangeUsername = (e) => setUsername(e.target.value);
  // Update date of birth state when the DOB input field changes
  const handleChangeDob = (e) => setDob(e.target.value);
  // Handle form submission to verify user details and send a password reset email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setError('');

    try {
      // Query the Firestore database to find the user by username  
      const userQuery = query(collection(db, 'userRequests'), where('username', '==', username));

      const querySnapshot = await getDocs(userQuery);
      
      if (!querySnapshot.empty) {
     // Extract user data if the username exists in the database
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        console.log('User Data:', userData);
        
     // Validate email and date of birth with the database records  
        if (userData.email === email && userData.dob === dob) {
          await sendPasswordResetEmail(auth, email);
          setMessage('Password reset email sent! Please check your inbox.');
        } else {
          setError('Incorrect information. Please check your username, email, or date of birth.');
        }
      } else {
        setError('User not found.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };
  // Navigate back to the login page
  const handleBackToLogin = () => {
    navigate('/');  
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChangeUsername}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChangeEmail}
            required
          />
        </div>
        <div>
          <h2>Security Question</h2>
          <label>Date of Birth (YYYY-MM-DD):</label>
          <input
            type="date"
            name="dob"
            value={dob}
            onChange={handleChangeDob}
            required
          />
        </div>
        <button type="submit" title = "Sends the reset link">Send Reset Link</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <button title = "Goes back to login" onClick={handleBackToLogin} className="back-button">Back to Login</button>
    </div>
  );
};

export default ForgotPassword;
