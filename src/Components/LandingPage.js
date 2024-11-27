import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase setup
import './LandingPage.css';

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get user information (username and role) from state passed via navigation
  const { username, userRole } = location.state || {};

  // State to store important messages fetched from Firestore
  const [importantMessages, setImportantMessages] = useState([]);

  // Fetch important messages from Firestore
  const fetchImportantMessages = async () => {
    try {
      const messagesCollection = collection(db, 'importantMessages');
      const messagesSnapshot = await getDocs(messagesCollection);
      const messages = messagesSnapshot.docs.map((doc) => ({
        id: doc.id, // Capture the document ID
        ...doc.data(), // Spread the fields in the document
      }));
      setImportantMessages(messages);
    } catch (error) {
      console.error('Error fetching important messages:', error);
    }
  };

  // Navigate to the respective role-based dashboard
  const goToDashboard = () => {
    if (userRole === 'administrator') {
      navigate('/admin', { state: { username } });
    } else if (userRole === 'manager') {
      navigate('/manager', { state: { username } });
    } else {
      navigate('/user-dashboard', { state: { username } });
    }
  };

  // Fetch important messages when the component is mounted
  useEffect(() => {
    fetchImportantMessages();
  }, []);

  return (
    <div className="landing-page-container">
      {/* Navbar with username and role display */}
      <div className="navbar">
        <span>Welcome, {username}!</span>
        <span>Role: {userRole}</span>
      </div>

      {/* Main content section */}
      <div className="main-content">
        <h2>Welcome to the Landing Page</h2>
        <p>This is the unified landing page for all users.</p>

        {/* Button to navigate to the user's role-specific dashboard */}
        <button onClick={goToDashboard}>Go to Dashboard</button>

        {/* Quick Links */}
        <div>
          <h3>Quick Links:</h3>
          <ul>
            <li><Link to="/general-ledger">General Ledger</Link></li>
            <li><Link to="/trial-balance">Trial Balance</Link></li>
            <li><Link to="/income-statement">Income Statement</Link></li>
          </ul>
        </div>

        {/* Important Messages Section */}
        <div className="important-messages">
          <h3>Important Messages</h3>
          {importantMessages.length > 0 ? (
            <ul>
              {importantMessages.map((message) => (
                <li key={message.id}>
                  <strong>{message.Type}:</strong> {message.Text}
                </li>
              ))}
            </ul>
          ) : (
            <p>No important messages at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;