import React, { useState, useEffect } from 'react';
import { confirmPasswordReset } from 'firebase/auth'; 
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import './ResetPassword.css';

const ResetPassword = () => {
  // State to store the new password, success message, and error message
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // Retrieves query parameters from the URL
  const [searchParams] = useSearchParams(); 
  const navigate = useNavigate();

  // Ensure the reset code (oobCode) is present in the query parameters
  useEffect(() => {
    if (!searchParams.get('oobCode')) {
      setError('Invalid or missing reset code.');
    }
  }, [searchParams]);

  // Updates the state whenever the password input field changes
  const handleChangePassword = (e) => {
    setNewPassword(e.target.value);
  };

 // Validates the password based on defined rules
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const startsWithLetter = /^[A-Za-z]/;
    return startsWithLetter.test(password) && passwordRegex.test(password);
  };

  // Handles the form submission for resetting the password
  const handleSubmit = async (e) => {
    e.preventDefault();

    const oobCode = searchParams.get('oobCode');  // Retrieve the reset code from the query parameters

     // If the reset code is invalid or missing, display an error
    if (!oobCode) {
      setError('Invalid or missing reset code.');
      return;
    }

     // Validate the entered password; show an error if it doesn't meet criteria
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long, start with a letter, and include at least one letter, one number, and one special character.');
      return;
    }

    try {
      // Use Firebase's confirmPasswordReset method to reset the password
      await confirmPasswordReset(auth, oobCode, newPassword);

      setMessage('Password has been successfully reset. You can now log in with your new password.');
      navigate('/'); 
    } catch (err) {
      console.error('Error details:', err);
      setError('Error resetting password: ' + err.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {!message && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              name="password"
              value={newPassword}
              onChange={handleChangePassword}
              required
            />
          </div>
          <button type="submit" title = "Confirms your inputs and sends you a email to reset your password" >Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
