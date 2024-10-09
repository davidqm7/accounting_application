import React, { useState, useEffect } from 'react';
import { confirmPasswordReset } from 'firebase/auth'; 
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchParams.get('oobCode')) {
      setError('Invalid or missing reset code.');
    }
  }, [searchParams]);

  const handleChangePassword = (e) => {
    setNewPassword(e.target.value);
  };


  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const startsWithLetter = /^[A-Za-z]/;
    return startsWithLetter.test(password) && passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oobCode = searchParams.get('oobCode'); 

    if (!oobCode) {
      setError('Invalid or missing reset code.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long, start with a letter, and include at least one letter, one number, and one special character.');
      return;
    }

    try {
      
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
