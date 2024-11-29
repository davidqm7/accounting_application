import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase setup
import './LandingPage.css';

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { username, userRole } = location.state || {};

  const [importantMessages, setImportantMessages] = useState([]);
  const [ratios, setRatios] = useState({
    currentRatio: null,
    debtRatio: null,
    debtToEquityRatio: null,
  });

  const fetchImportantMessages = async () => {
    try {
      const messagesCollection = collection(db, 'importantMessages');
      const messagesSnapshot = await getDocs(messagesCollection);
      const messages = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImportantMessages(messages);
    } catch (error) {
      console.error('Error fetching important messages:', error);
    }
  };

  const fetchAndCalculateRatios = async () => {
    try {
      const journalEntriesCollection = collection(db, 'journalEntries');
      const snapshot = await getDocs(journalEntriesCollection);
      const journalEntries = snapshot.docs.map((doc) => doc.data());

      // Initialize totals
      let assets = 0;
      let liabilities = 0;
      let equity = 0;

      // Process each transaction
      journalEntries.forEach((entry) => {
        entry.transactionArray.forEach((transaction) => {
          const [name, type, description, amount] = transaction.split(',');
          const value = parseFloat(amount) || 0;

          if (['asset', 'debit'].includes(type.toLowerCase())) {
            assets += value;
          } else if (['liability', 'credit'].includes(type.toLowerCase())) {
            liabilities += value;
          }
        });
      });

      // Calculate ratios
      const currentRatio = assets / liabilities || 0;
      const debtRatio = liabilities / assets || 0;
      const debtToEquityRatio = liabilities / (assets - liabilities) || 0;

      setRatios({ currentRatio, debtRatio, debtToEquityRatio });
    } catch (error) {
      console.error('Error calculating ratios:', error);
    }
  };

  const goToDashboard = () => {
    if (userRole === 'administrator') {
      navigate('/admin', { state: { username } });
    } else if (userRole === 'manager') {
      navigate('/manager', { state: { username } });
    } else {
      navigate('/user-dashboard', { state: { username } });
    }
  };

  const getRatioColor = (ratio, range) => {
    if (ratio < range.low) return 'red';
    if (ratio > range.high) return 'green';
    return 'yellow';
  };

  useEffect(() => {
    fetchImportantMessages();
    fetchAndCalculateRatios();
  }, []);

  return (
    <div className="landing-page-container">
      <div className="navbar">
        <span>Welcome, {username}!</span>
        <span>Role: {userRole}</span>
      </div>

      <div className="main-content">
        <h2>Welcome to the Landing Page</h2>
        <p>This is the unified landing page for all users.</p>

        {/* Ratios Section */}
        <div className="ratios-section">
          <h3>Financial Ratios</h3>
          <ul>
            <li style={{ color: getRatioColor(ratios.currentRatio, { low: 1.2, high: 2.0 }) }}>
              Current Ratio: {ratios.currentRatio ? ratios.currentRatio.toFixed(2) : 'Calculating...'}
            </li>
            <li style={{ color: getRatioColor(ratios.debtRatio, { low: 0.3, high: 0.6 }) }}>
              Debt Ratio: {ratios.debtRatio ? ratios.debtRatio.toFixed(2) : 'Calculating...'}
            </li>
            <li style={{ color: getRatioColor(ratios.debtToEquityRatio, { low: 1.0, high: 2.0 }) }}>
              Debt-to-Equity Ratio: {ratios.debtToEquityRatio ? ratios.debtToEquityRatio.toFixed(2) : 'Calculating...'}
            </li>
          </ul>
        </div>

        <button onClick={goToDashboard}>Go to Dashboard</button>

        <div>
          <h3>Quick Links:</h3>
          <ul>
            <li><Link to="/general-ledger">General Ledger</Link></li>
            <li><Link to="/trial-balance">Trial Balance</Link></li>
            <li><Link to="/income-statement">Income Statement</Link></li>
          </ul>
        </div>

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
