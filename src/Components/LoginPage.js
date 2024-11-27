import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from '../firebase'; 
import './LoginPage.css';

const LoginPage = () => {
    // State for login form inputs and error message
    const [formData, setFormData] = useState({
      username: '',  
      password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Update form data on user input
    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
    };

    // Handle form submission to log in the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Query Firestore for the username
            const q = query(collection(db, "userRequests"), where("username", "==", formData.username));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setErrorMessage('Username does not exist.');
                return;
            }

            // Extract user data from Firestore
            const userDoc = querySnapshot.docs[0];  
            const userData = userDoc.data();
            const email = userData.email;  

            // Authenticate user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, formData.password);
            const username = userData.username;
            const userRole = userData.role;

            // Redirect to Landing Page with username and role
            navigate('/landing', { state: { username, userRole } });
        } catch (err) {
            setErrorMessage('Invalid username or password. Please try again.');
        }
    };

    // Navigate to the Register Page
    const goToRegister = () => {
        navigate('/register');
    };

    // Navigate to the Forgot Password Page
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
                {/* Display error message if login fails */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>

            <div className="additional-links">
                {/* Forgot Password and Register buttons */}
                <button onClick={handleForgotPassword}>Forgot Password?</button>
                <p>Don't have an account?</p>
                <button onClick={goToRegister}>Register</button>
            </div>
        </div>
    );
};

export default LoginPage;
