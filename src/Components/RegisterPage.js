import React, { useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc } from "firebase/firestore"; 
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    role:'',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "userRequests"), {
        ...formData,
        status: "pending", 
        createdAt: new Date(),
      });
      
      setMessage("Request submitted successfully! Waiting for admin approval.");
    } catch (err) {
      console.error("Error submitting request: ", err);
    }
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
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;