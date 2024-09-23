import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import './ForgotPassword.css';


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(''); 
      setError(''); 
  
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent! Please check your inbox.');
      } catch (err) {
        setError('Error: ' + err.message);
      }
    };
  
    return (
      <div className="forgot-password-container">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
  
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  };
  
  export default ForgotPasswordPage;