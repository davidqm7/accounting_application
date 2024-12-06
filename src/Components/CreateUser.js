import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './CreateUser.css'; 
// React functional component for creating a new user
const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  // Handle form submission to create a new user and save their details to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   // Create a new user with a default password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, 'defaultPassword123'); 
      const user = userCredential.user;

  // Add the new user's details to the 'users' collection in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role,
        status: 'Active',
        createdAt: new Date(),
      });
      // Show success message to the admin
      alert(`User Created Successfully! Username: ${username}, Email: ${email}, Role: ${role}`);
    } catch (error) {
      // Handle and log any errors that occur during user creation
      console.error("Error creating user:", error);
      alert('Error creating user. Please try again.');
    }
  };

  return (
    <div className="create-user-container">
      <h1>Create New User</h1>
      <div className="section">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Assign Role</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              required
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>

          <button title = "Creates a new user" type="submit">Create User</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
