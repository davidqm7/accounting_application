import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { doc, getDoc } from "firebase/firestore"; 
import { db } from '../firebase'; 
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
            const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password);
            const user = userCredential.user;

           
            const userDoc = await getDoc(doc(db, "users", user.uid)); 
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userRole = userData.role; 

                // Navigate based on the role
                if (userRole === 'administrator') {
                    navigate('/admindashboard'); 
                } else if(userRole === "manager"){
                  navigate('/manager'); 
                }
                else {
                    navigate('/user-dashboard'); 
                }
            } else {
                setErrorMessage("User does not exist in the database.");
            }
        } catch (err) {
            setErrorMessage('Invalid username or password. Please try again.');
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
