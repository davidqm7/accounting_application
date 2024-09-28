import React, { useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dob: '',
    address: '',
    role: '',
  });

  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  const validatePassword = (password) => {
    const minLength = 8;
    const startsWithLetter = /^[A-Za-z]/.test(password); // Check if the password starts with a letter
    const hasLetter = /[A-Za-z]/.test(password); // Check for at least one letter
    const hasNumber = /[0-9]/.test(password); // Check for at least one number
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Check for at least one special character

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!startsWithLetter) {
      return "Password must start with a letter.";
    }
    if (!hasLetter) {
      return "Password must contain at least one letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    
    return ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return; 
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await addDoc(collection(db, "userRequests"), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        address: formData.address,
        role: formData.role,
        status: "pending",
        createdAt: new Date(),
        password: formData.password,
      });

      setMessage("Request submitted successfully! Waiting for admin approval.");
    } catch (err) {
      console.error("Error submitting request: ", err);
      setMessage("Error: " + err.message);
    }
  };

  const goToLogin = () => {
    navigate('/');
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
          {passwordError && <p className="error-message">{passwordError}</p>} 
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="administrator">Administrator</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      <p>Already have an account?</p>
      <button onClick={goToLogin}>Login</button>
    </div>
  );
};

export default RegisterPage;
