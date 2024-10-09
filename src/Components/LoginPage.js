import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { collection, query, where, getDocs } from "firebase/firestore"; 
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
            
            const q = query(collection(db, "userRequests"), where("username", "==", formData.username));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setErrorMessage('Username does not exist.');
                return;
            }

            
            const userDoc = querySnapshot.docs[0];  
            const userData = userDoc.data();
            const email = userData.email;  

            
            const userCredential = await signInWithEmailAndPassword(auth, email, formData.password);
            const user = userCredential.user;

            const username = userData.username;
            const userRole = userData.role;

            
            if (userRole === 'administrator') {
                navigate('/admin', { state: { username } });
            } else if (userRole === 'manager') {
                navigate('/manager', { state: { username } });
            } else {
                navigate('/user-dashboard', { state: { username } });
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
                <button type="submit" title = "Logs the user if the information is correct" >Login</button>
            </form>

            <div className="additional-links">
                <button title = "Takes you to forgot password page" onClick={handleForgotPassword}>Forgot Password?</button>
                <p>Don't have an account?</p>
                <button 
                title = "Takes you to the register page"
                onClick={goToRegister}>Register</button>
            </div>
        </div>
    );
};

export default LoginPage;
