import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
    });


const [errorMessage, setErrorMessage] = useState('');
const navigate = useNavigate();

const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard'); //Navigate where it was to
    } catch (err) {
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

const goToRegister = () => {
    navigate('/register');
  };


const handleForgotPassword = () => {
    navigate('/forgot-password'); 
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>

      <div className="additional-links">
        <button onClick={handleForgotPassword}>Forgot Password?</button>
        <p>Don't have an account?</p>
        <button onClick={goToRegister}>Register</button>
      </div>
    </div>
  );
};

export default LoginPage;



